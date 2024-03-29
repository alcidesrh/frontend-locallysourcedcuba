<script lang="ts">
import useHtcTourTemplate from 'src/pages/tour/template/htc/htcTourTemplateService';
import FormTourTemplateInformation from 'src/pages/tour/template/components/FormTourTemplateInformation.vue';
import FormTourTemplateNotification from 'src/pages/tour/template/components/FormTourTemplateNotification.vue';
import FormHtcTourTemplateActivity from 'src/pages/tour/template/htc/htcTourTemplateForm/FormHtcTourTemplateActivity.vue';
import { defineComponent, computed, provide } from 'vue';
import { useRouter } from 'vue-router';

import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import {
  createTourTemplateMutation,
  updateHtcTourTemplateMutation,
  listHtcTourTemplateQuery,
} from 'src/graphql/query/tourTemplate.graphql';
import { cloneDeep, pick } from 'lodash-es';
import { TourTemplate } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    let { item, items, list, tourTemplateFormStep } = useHtcTourTemplate();

    provide('item', item);
    provide('items', items);
    provide('list', list);

    tourTemplateFormStep.value = 1;

    const router = useRouter();

    const {
      mutate: createTourTemplate,
      loading: loadingCreate,
      onError,
    } = useMutation(createTourTemplateMutation, () => ({
      update: (
        cache,
        {
          data: {
            createTourTemplate: { tourTemplate },
          },
        }
      ) => {
        item.value = tourTemplate as TourTemplate;

        const data: {
          tourTemplates: Partial<TourTemplate>[];
        } | null = cache.readQuery({
          query: listHtcTourTemplateQuery,
        });

        let newItems: Partial<TourTemplate>[] = [];
        if (data && data.tourTemplates)
          newItems = cloneDeep(data?.tourTemplates);
        newItems.push(tourTemplate);
        items.value = newItems;

        cache.writeQuery({
          query: listHtcTourTemplateQuery,
          data: {
            tourTemplates: items.value,
          },
        });
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    const {
      mutate: updateTourTemplate,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateHtcTourTemplateMutation, () => ({
      update: (cache) => {
        const data: {
          tourTemplates: Partial<TourTemplate>[];
        } | null = cache.readQuery({
          query: listHtcTourTemplateQuery,
        });
        if (data) {
          items.value = data.tourTemplates;
        }
      },
    }));

    onErrorUpdate((e: Error) => {
      error(e);
    });

    return {
      item,
      tourTemplateFormStep,
      cancel() {
        void router.push({ name: 'ListTourTemplate' });
        item.value = {};
      },
      loading: computed(() => loadingCreate.value || loadingUpdate.value),
      saveInformation() {
        const data = pick(item.value, [
          'id',
          'name',
          'type',
          'code',
          'color',
          'description',
          'startPlace',
          'finishPlace',
        ]);
        let templates = {};
        if (item.value.template1) {
          templates = {
            template1: item.value.template1.id,
            template2: item.value.template2?.id,
          };
        }
        if (item.value.id)
          void updateTourTemplate({
            input: { ...data, ...templates },
          });
        else
          void createTourTemplate({
            input: {
              ...data,
              ...templates,
              tourType: 'htc',
            },
          });
      },
    };
  },
  components: {
    FormTourTemplateInformation,
    FormTourTemplateNotification,
    FormHtcTourTemplateActivity,
  },
});
</script>

<template >
  <q-stepper v-model="tourTemplateFormStep" color="primary" animated header-nav>
    <q-step :name="1" title="TourTemplate Data" icon="description" :done="tourTemplateFormStep > 1">
      <FormTourTemplateInformation @submit="saveInformation" :loading="loading">
        <div class="col-12 col-sm-4">
          <BaseInput v-model="item.startPlace" label="Start place" validate></BaseInput>
        </div>
        <div class="col-12 col-sm-4">
          <BaseInput v-model="item.finishPlace" label="End place" validate></BaseInput>
        </div>
      </FormTourTemplateInformation>
      <q-stepper-navigation v-if="item.id">
        <div class="tw-mb-5 tw-mt-2">
          <div class="tw-flex tw-align-middle tw-justify-end">
            <BaseButton
              icon-right="arrow_forward"
              label="Next"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourTemplateFormStep++"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="2"
      title="Notifications"
      icon="notifications_active"
      :disable="!item.id"
      :done="tourTemplateFormStep > 2"
    >
      <FormTourTemplateNotification />
      <q-stepper-navigation>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
          <div>
            <BaseButton
              icon="arrow_back"
              label="Back"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourTemplateFormStep--"
            />
          </div>
          <div class="tw-flex tw-align-middle tw-justify-end">
            <BaseButton
              icon-right="arrow_forward"
              label="Next"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourTemplateFormStep++"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>

    <q-step :name="3" title="Activities" icon="local_activity" :disable="!item.id">
      <FormHtcTourTemplateActivity />
      <q-stepper-navigation>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
          <div>
            <BaseButton
              icon="arrow_back"
              label="Back"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourTemplateFormStep--"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>
