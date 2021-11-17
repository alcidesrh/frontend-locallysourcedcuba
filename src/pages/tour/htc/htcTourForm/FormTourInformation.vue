<script lang="ts">
import { defineComponent, watch, ref, inject } from 'vue';
import useHtcTour from 'src/pages/tour/htc/htcTourService';
import { getTourTemplateQuery } from 'src/graphql/query/tourTemplate.graphql';
import { useLazyQuery } from '@vue/apollo-composable';

import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import {
  createTourMutation,
  updateHtcTourMutation,
  listTourQuery,
} from 'src/graphql/query/tour.graphql';
import { pick, omit } from 'lodash-es';
import { Tour, TourTemplate } from 'src/graphql/@types/types';
import useService from 'src/pages/service/serviceService';
import dayjs from 'dayjs';
import globalLoading from 'src/store/loading';
import useGuide from 'src/pages/guide/guideService';

export default defineComponent({
  setup() {
    const edit = inject('edit');
    const loadTours = inject('loadTours') as (
      q: unknown,
      v: unknown,
      p: unknown
    ) => void;

    const { service } = useService();

    const { item, templates, getTemplates, search } = useHtcTour();

    let { getGuides, guides } = useGuide();
    const guidesSelect = ref(guides.value);
    if (!guides.value.length) getGuides();

    const template = ref<Partial<TourTemplate>>({});

    item.value.agent = item.value.agent || false;

    if (typeof item.value.description == 'undefined')
      item.value.description = null;

    const startDate = ref('');
    if (typeof item.value.startDate != 'undefined')
      startDate.value = dayjs(item.value.startDate as string).format(
        'DD/MM/YYYY'
      );

    const {
      onError: onErrorGetTemplate,
      onResult,
      loading: loadingTemplate,
      load: getTemplate,
    } = useLazyQuery(getTourTemplateQuery);

    onResult((result: { data: { tourTemplate: TourTemplate } }) => {
      template.value = result.data.tourTemplate;
      item.value.template = pick(template.value, [
        'id',
        'name',
        'color',
        'type',
      ]) as TourTemplate;
      item.value.startPlace = template.value.startPlace;
      item.value.finishPlace = template.value.finishPlace;
      item.value.description = template.value.description;
      item.value.color = template.value.color;
      item.value.notifications = [];

      item.value.activities = template.value.activities;
    });

    onErrorGetTemplate((e: Error) => {
      error(e);
    });

    if (!edit)
      watch(
        () => item.value.template as Partial<TourTemplate>,
        (val: Partial<TourTemplate>) => {
          getTemplate(getTourTemplateQuery, {
            id: val.id,
          });
        }
      );

    const startDatePopup = ref(false);

    watch(
      () => item.value.startDate,
      () => {
        startDatePopup.value = false;
        startDate.value = dayjs(item.value.startDate as string).format(
          'DD/MM/YYYY'
        );
      }
    );

    const {
      mutate: createTour,
      loading: loadingCreate,
      onError,
    } = useMutation(createTourMutation, () => ({
      update: (
        cache,
        {
          data: {
            createTour: { tour },
          },
        }
      ) => {
        loadTours(
          listTourQuery,
          { ...search.value },
          {
            fetchPolicy: 'network-only',
          }
        );
        item.value = tour as Tour;
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    const {
      mutate: updateTour,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateHtcTourMutation);

    onErrorUpdate((e: Error) => {
      error(e);
    });

    const loadingTemplates = ref(false);

    watch(
      [loadingCreate, loadingTemplate, loadingUpdate, loadingTemplates],
      ([v, v2, v3, v4]) => (globalLoading.value = v || v2 || v3 || v4)
    );

    if (!edit && !templates.value.length) {
      loadingTemplates.value = true;
      const { loading } = getTemplates();
      watch(loading, (v) => {
        loadingTemplates.value = v;
      });
    }

    return {
      item,
      templates,
      guidesSelect,
      startDatePopup,
      startDate,
      saveInformation() {
        const data = omit(item.value, [
          'notifications',
          'activities',
          'bookings',
          'template',
        ]);
        if (item.value.id) {
          void updateTour({
            input: { ...data, guide: item.value.guide?.id || null },
          });
        } else
          void createTour({
            input: {
              ...data,
              service: service.value.id,
              template: item.value.template?.id,
              name: item.value.template?.name,
              guide: item.value.guide?.id || null,
            },
          });
      },
      optionsFn(date: string) {
        return date >= dayjs().format('YYYY/MM/DD');
      },
      filterFn(val: string, update: (fn: () => void) => void) {
        if (val === '') {
          update(() => {
            guidesSelect.value = guides.value;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          guidesSelect.value = guides.value.filter(
            (v) => v.name && v.name.toLowerCase().indexOf(needle) > -1
          );
        });
      },
    };
  },
});
</script>

<template >
  <div class="tw-relative">
    <q-form @submit="saveInformation" class="q-mt-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <BaseSelect
            v-model="item.template"
            :options="templates"
            label="Templates"
            validate
            :readonly="!!item.id"
          >
            <template v-slot:selected-item="scope">
              <div class="row tw-w-full">
                <div
                  class="col"
                  :style="{maxWidth: '30px', height: '30px', backgroundColor: scope.opt.color}"
                ></div>

                <div class="col tw-flex tw-justify-between tw-items-center">
                  <label class="tw-ml-3" v-html="scope.opt.name"></label>
                  <label class="tw-text-sm tw-text-gray-400">{{ scope.opt.type }}</label>
                </div>
              </div>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" class="tw-flex tw-items-center">
                <q-section avatar>
                  <div :style="{width: '30px', height: '30px', backgroundColor: scope.opt.color}"></div>
                </q-section>
                <q-item-section class="tw-ml-3">
                  <q-item-label v-html="scope.opt.name" />
                  <q-item-label caption>{{ scope.opt.type }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </BaseSelect>
        </div>
        <div class="col-8 col-md-4">
          <BaseInput readonly v-model="startDate" :validate="!item.startDate" label="Start Date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  v-model="startDatePopup"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    minimal
                    v-model="item.startDate"
                    default-view="Months"
                    :options="optionsFn"
                  ></q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </BaseInput>
        </div>
        <div class="col-4 col-md-2">
          <BaseCheckBox label="From agent" v-model="item.agent"></BaseCheckBox>
        </div>

        <div class="col-12 col-sm-6">
          <BaseInput v-model="item.startPlace" label="Start place" validate></BaseInput>
        </div>
        <div class="col-12 col-sm-6">
          <BaseInput v-model="item.finishPlace" label="End place" validate></BaseInput>
        </div>

        <div class="col-12 col-md-6">
          <BaseSelect
            v-model="item.guide"
            :options="guidesSelect"
            label="Guide"
            option-label="name"
            option-value="id"
            use-input
            @filter="filterFn"
          ></BaseSelect>
        </div>

        <div class="col-12 tw-mt-3">
          <p class="tw-text-lg tw-mb-3">Extra Information</p>
          <BaseEditor v-model="item.description"></BaseEditor>
        </div>
        <div class="col-12 tw-text-right">
          <BaseButton
            label="Save"
            type="submit"
            color="primary"
            class="q-ml-sm"
            :loading="loading"
          />
        </div>
      </div>
    </q-form>
  </div>
</template>
