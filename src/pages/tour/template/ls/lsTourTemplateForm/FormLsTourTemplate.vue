<script lang="ts">
import useLsTourTemplate from 'src/pages/tour/template/ls/lsTourTemplateService';
import useDestination from 'src/pages/destination/destinationService';
import FormTourTemplateInformation from 'src/pages/tour/template/components/FormTourTemplateInformation.vue';
import FormTourTemplateNotification from 'src/pages/tour/template/components/FormTourTemplateNotification.vue';
import FormLsTourTemplateItinerary from 'src/pages/tour/template/ls/lsTourTemplateForm/FormLsTourTemplateItinerary.vue';
import { defineComponent, computed, provide } from 'vue';
import { useRouter } from 'vue-router';

import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import {
  createLsTourTemplateMutation,
  updateLsTourTemplateMutation,
  listLsTourTemplateQuery,
} from 'src/graphql/query/tourTemplate.graphql';
import { cloneDeep, pick } from 'lodash-es';
import { TourTemplate } from 'src/graphql/@types/types';
import dayjs from 'dayjs';
import gql from 'graphql-tag';
import useTransportation from 'src/pages/transportation/transportationService';
import useHouseType from 'src/pages/house/houseTypeService';

export default defineComponent({
  setup() {
    const { items, item, list, tourTemplateFormStep } = useLsTourTemplate();

    const { destinations, destinationsList } = useDestination();

    if (!destinations.value.length) {
      destinationsList(gql`
        query destinationsQuery {
          destinations {
            id
            _id
            name
          }
        }
      `);
    }

    const { itemsSelect: transportations, listSelect } = useTransportation();
    if (!transportations.value.length) listSelect();

    const { list: houseTypesList, items: houseTypes } = useHouseType();
    if (!houseTypes.value.length) houseTypesList();

    provide('item', item);
    provide('items', items);
    provide('list', list);
    tourTemplateFormStep.value = 1;

    const router = useRouter();

    const {
      mutate: createTourTemplate,
      loading: loadingCreate,
      onError,
    } = useMutation(createLsTourTemplateMutation, () => ({
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
          query: listLsTourTemplateQuery,
        });

        let newItems: Partial<TourTemplate>[] = [];
        if (data && data.tourTemplates)
          newItems = cloneDeep(data?.tourTemplates);
        newItems.push(tourTemplate);
        items.value = newItems;

        cache.writeQuery({
          query: listLsTourTemplateQuery,
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
    } = useMutation(updateLsTourTemplateMutation, () => ({
      update: (cache) => {
        const data: {
          tourTemplates: Partial<TourTemplate>[];
        } | null = cache.readQuery({
          query: listLsTourTemplateQuery,
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
      destinationsInSelect: computed(() =>
        destinations.value.filter((e) => e.id != item.value.transferOut?.id)
      ),
      destinationsOutSelect: computed(() =>
        destinations.value.filter((e) => e.id != item.value.transferIn?.id)
      ),
      transportations,
      houseTypes,
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
          'days',
          'startDay',
          'guideWage',
          'bonus',
          'description',
        ]);
        let templates = {};
        if (item.value.template1) {
          templates = {
            template1: item.value.template1.id,
            template2: item.value.template2?.id,
          };
        }
        let transfers = {};
        if (item.value.transferIn) {
          transfers = {
            transferIn: item.value.transferIn.id,
            transferOut: item.value.transferOut?.id,
          };
        }
        if (item.value.id)
          void updateTourTemplate({
            input: {
              ...data,
              ...templates,
              ...transfers,
              transportation:
                item.value.transportation?.id || item.value.transportation,
              houseType: item.value.houseType?.id || item.value.houseType,
            },
          });
        else
          void createTourTemplate({
            input: {
              ...data,
              ...templates,
              ...transfers,
              tourType: 'ls',
              transportation:
                item.value.transportation?.id || item.value.transportation,
              houseType: item.value.houseType?.id || item.value.houseType,
            },
          });
      },
      days: computed(() => {
        let days: Partial<Record<string, unknown>[]> = [];
        for (let i = 0; i < 7; i++) {
          days.push({ name: dayjs().day(i).format('dddd'), number: i });
        }
        return days;
      }),
    };
  },
  components: {
    FormTourTemplateInformation,
    FormLsTourTemplateItinerary,
    FormTourTemplateNotification,
  },
});
</script>

<template >
  <q-stepper v-model="tourTemplateFormStep" color="primary" animated header-nav>
    <q-step
      :name="1"
      title="Tour Template Data"
      icon="description"
      :done="tourTemplateFormStep > 1"
    >
      <FormTourTemplateInformation @submit="saveInformation" :loading="loading">
        <div class="col-6 col-sm-3 col-md-2" v-if="item.type != 'Tailor Made'">
          <BaseInput v-model.number="item.days" label="Days number" type="number"></BaseInput>
        </div>
        <div class="col-6 col-sm-3" v-if="item.type != 'Private' && item.type != 'Tailor Made'">
          <BaseSelect
            v-model="item.startDay"
            :options="days"
            label="Start day"
            option-label="name"
            option-value="number"
            emit-value
            map-options
            validate
          ></BaseSelect>
        </div>
        <div class="col-6 col-sm-3 col-md-2">
          <BaseInput v-model.number="item.guideWage" label="Guide wage" type="number"></BaseInput>
        </div>
        <div class="col-6 col-sm-3 col-md-2">
          <BaseInput v-model.number="item.bonus" label="Bonus activities" type="number"></BaseInput>
        </div>
        <div class="col-12">
          <div class="row q-col-gutter-md">
            <div class="col-6 col-sm-4" v-if="item.type != 'Mixed'">
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
            <div class="col-6 col-sm-4" v-if="item.type != 'Mixed'">
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
            <div class="col-6 col-sm-4">
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
            <div class="col-6 col-sm-4">
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
      title="Itinerary"
      icon="event_note"
      :disable="!item.id"
      :done="tourTemplateFormStep > 2"
    >
      <FormLsTourTemplateItinerary />
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

    <q-step
      :name="3"
      title="Notifications"
      icon="notifications_active"
      :disable="!item.id"
      :done="tourTemplateFormStep > 4"
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
  </q-stepper>
</template>
