<script lang="ts">
import { defineComponent, watch, ref, computed, inject } from 'vue';
import useLsTour from 'src/pages/tour/ls/lsTourService';
import { getLsTourTemplateQuery } from 'src/graphql/query/tourTemplate.graphql';
import { useLazyQuery } from '@vue/apollo-composable';
import { TourTemplate } from 'src/graphql/@types/types';

import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import {
  createLsTourMutation,
  updateLsTourMutation,
  listLsTourQuery,
} from 'src/graphql/query/tour.graphql';
import { pick, omit } from 'lodash-es';
import { Tour } from 'src/graphql/@types/types';
import dayjs from 'dayjs';
import globalLoading from 'src/store/loading';
import useDestination from 'src/pages/destination/destinationService';
import useTransportation from 'src/pages/transportation/transportationService';
import useHouseType from 'src/pages/house/houseTypeService';
import useService from 'src/pages/service/serviceService';
import useGuide from 'src/pages/guide/guideService';

export default defineComponent({
  setup() {
    const edit = inject('edit');

    const { service } = useService();

    const { item, templates, getTemplates, list, search } = useLsTour();

    const { loadTours, loading: laodingLoadTour } = list();

    const template = ref<Partial<TourTemplate>>({});

    let { getGuides, guides } = useGuide();
    const guidesSelect = ref(guides.value);
    if (!guides.value.length) getGuides();

    item.value.agent = item.value.agent || false;

    if (typeof item.value.description == 'undefined')
      item.value.description = null;

    const startDate = ref('');
    if (typeof item.value.startDate != 'undefined')
      startDate.value = dayjs(item.value.startDate as string).format(
        'DD/MM/YYYY'
      );

    const { destinations } = useDestination();

    const { itemsSelect: transportations } = useTransportation();

    const { items: houseTypes } = useHouseType();

    const endDate = ref('');
    if (typeof item.value.endDate != 'undefined')
      endDate.value = dayjs(item.value.endDate as string).format('DD/MM/YYYY');

    const {
      onError: onErrorGetTemplate,
      onResult,
      loading: loadingTemplate,
      load: getTemplate,
    } = useLazyQuery(getLsTourTemplateQuery);

    onResult((result: { data: { tourTemplate: TourTemplate } }) => {
      template.value = result.data.tourTemplate;
      item.value.template = pick(template.value, [
        'id',
        'name',
        'color',
        'type',
      ]) as TourTemplate;
      item.value.startDay = template.value.startDay;
      item.value.days = template.value.days;
      item.value.description = template.value.description;
      item.value.color = template.value.color;
      item.value.transferIn = template.value.transferIn;
      item.value.transferOut = template.value.transferOut;
      item.value.transportation = template.value.transportation;
      item.value.houseType = template.value.houseType;
      item.value.guideWage = template.value.guideWage;
      item.value.bonus = template.value.bonus;
      item.value.notifications = [];
    });

    onErrorGetTemplate((e: Error) => {
      error(e);
    });

    if (!edit)
      watch(
        () => item.value.template as Partial<TourTemplate>,
        (val: Partial<TourTemplate>) => {
          getTemplate(getLsTourTemplateQuery, {
            id: val.id,
          });
        }
      );

    const startDatePopup = ref(false);
    const endDatePopup = ref(false);

    watch(
      () => item.value.startDate,
      () => {
        startDatePopup.value = false;
        startDate.value = dayjs(item.value.startDate as string).format(
          'DD/MM/YYYY'
        );

        item.value.endDate = dayjs(item.value.startDate as string)
          .add(item.value.days as number, 'day')
          .format();
        endDate.value = dayjs(item.value.endDate).format('DD/MM/YYYY');
      }
    );

    const {
      mutate: createTour,
      loading: loadingCreate,
      onError,
    } = useMutation(createLsTourMutation, () => ({
      update: (
        cache,
        {
          data: {
            createTour: { tour },
          },
        }
      ) => {
        loadTours(
          listLsTourQuery,
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
    } = useMutation(updateLsTourMutation);

    onErrorUpdate((e: Error) => {
      error(e);
    });

    const loadingTemplates = ref(false);

    watch(
      [
        loadingCreate,
        loadingTemplate,
        laodingLoadTour,
        loadingUpdate,
        loadingTemplates,
      ],
      ([v, v2, v3, v4, v5]) => (globalLoading.value = v || v2 || v3 || v4 || v5)
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
      endDatePopup,
      startDate,
      endDate,
      transportations,
      houseTypes,
      destinationsInSelect: computed(() =>
        destinations.value.filter((e) => e.id != item.value.transferOut?.id)
      ),
      destinationsOutSelect: computed(() =>
        destinations.value.filter((e) => e.id != item.value.transferIn?.id)
      ),
      saveInformation() {
        const data = omit(item.value, [
          'notifications',
          'activities',
          'bookings',
          'template',
          'itineraries',
        ]);
        let transfers = {};
        if (item.value.transferIn) {
          transfers = {
            transferIn: item.value.transferIn.id,
            transferOut: item.value.transferOut?.id,
          };
        }
        if (item.value.id)
          void updateTour({
            input: {
              ...data,
              ...transfers,
              transportation:
                item.value.transportation?.id || item.value.transportation,
              houseType: item.value.houseType?.id || item.value.houseType,
              guide: item.value.guide?.id || null,
            },
          });
        else {
          void createTour({
            input: {
              ...data,
              ...transfers,
              transportation:
                item.value.transportation?.id || item.value.transportation,
              houseType: item.value.houseType?.id || item.value.houseType,
              service: service.value.id,
              template: item.value.template?.id,
              name: item.value.template?.name,
              guide: item.value.guide?.id || null,
            },
          });
        }
      },
      optionsFn(date: string) {
        return date >= dayjs().format('YYYY/MM/DD');
      },
      day: computed(() =>
        item.value.startDay ? dayjs(item.value.startDay).format('dddd') : null
      ),
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
        <div class="col-3 col-md-2">
          <BaseInput v-model="item.days" label="Days" readonly></BaseInput>
        </div>
        <div class="col-5 col-sm-4 col-md-2">
          <BaseInput v-model="day" label="Start day" readonly></BaseInput>
        </div>
        <div class="col-4 col-md-2">
          <BaseCheckBox label="From agent" v-model="item.agent"></BaseCheckBox>
        </div>
        <div class="col-6 col-md-4">
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
        <div class="col-6 col-md-4">
          <BaseInput readonly v-model="endDate" label="End Date"></BaseInput>
        </div>
        <div class="col-12">
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-4" v-if="item.type != 'Mixed'">
              <BaseSelect
                clearable
                v-model="item.transferIn"
                :options="destinationsInSelect"
                label="Transfer in"
                option-label="name"
                option-value="id"
                map-options
                validate
              ></BaseSelect>
            </div>
            <div class="col-6 col-md-4" v-if="item.type != 'Mixed'">
              <BaseSelect
                clearable
                v-model="item.transferOut"
                :options="destinationsOutSelect"
                label="Transfer out "
                option-label="name"
                option-value="id"
                map-options
                validate
              ></BaseSelect>
            </div>
          </div>
        </div>

        <div class="col-12">
          <div class="row q-col-gutter-md">
            <div class="col-6 col-md-4">
              <BaseSelect
                clearable
                v-model="item.transportation"
                :options="transportations"
                label="Transportation"
                option-label="name"
                option-value="id"
                map-options
              ></BaseSelect>
            </div>
            <div class="col-6 col-md-4">
              <BaseSelect
                clearable
                v-model="item.houseType"
                :options="houseTypes"
                label="Accommodation type"
                option-label="name"
                option-value="id"
                map-options
              ></BaseSelect>
            </div>
          </div>
        </div>

        <div class="col-6 col-md-4">
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

        <div class="col-3 col-sm-2">
          <BaseInput v-model.number="item.guideWage" label="Guide wage" type="number"></BaseInput>
        </div>
        <div class="col-3 col-sm-2">
          <BaseInput v-model.number="item.bonus" label="Bonus activities" type="number"></BaseInput>
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
