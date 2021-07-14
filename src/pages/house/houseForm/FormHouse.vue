<script lang="ts">
import useHouse from 'src/pages/house/houseService';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import useHouseType from '../houseTypeService';
import houseFeatureService from '../houseFeatureService';
import useDestination from 'src/pages/destination/destinationService';
import useHouseRoomType from '../houseRoomTypeService';
import { HouseRoom } from 'src/graphql/@types/types.d';
import FormHouseRoom from './FormHouseRoom.vue';
import FormHouseSeason from './FormHouseSeason.vue';

export default defineComponent({
  components: { FormHouseRoom, FormHouseSeason },
  setup() {
    let { item, houseFormStep } = useHouse();

    houseFormStep.value = 1;

    if (typeof item.value.description == 'undefined') {
      item.value.description = '';
    }

    let { list: houseTypesList, items: houseTypes } = useHouseType();

    let { destinationsList, destinations } = useDestination();

    let { list: featuresList, items: features } = houseFeatureService();

    let { list: houseRoomTypesList, items: houseRoomTypes } =
      useHouseRoomType();

    if (!houseTypes.value.length) houseTypesList();

    if (!destinations.value.length) destinationsList();

    if (!features.value.length) featuresList();

    if (!houseRoomTypes.value.length) houseRoomTypesList();

    const destinationsSelect = ref(destinations.value);

    const houseRooms = ref<Partial<HouseRoom>[]>([]);
    const houseRoom = ref<Partial<HouseRoom>>({});

    const router = useRouter();
    return {
      item,
      houseTypes,
      features,
      destinationsSelect,
      houseRoomTypes,
      houseRoom,
      houseRooms,
      houseFormStep,
      cancel() {
        void router.push({ name: 'ListHouse' });
        item.value = {};
      },
      filterFn(val: string, update: (fn: () => void) => void) {
        if (val === '') {
          update(() => {
            destinationsSelect.value = destinations.value;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          destinationsSelect.value = destinations.value.filter((v) => {
            if (v.name) return v.name.toLowerCase().indexOf(needle) > -1;
            return false;
          });
        });
      },
    };
  },
  props: ['loading'],
  emits: ['submit'],
  methods: {
    onSubmit() {
      this.$emit('submit');
    },
  },
});
</script>


<template >
  <q-stepper v-model="houseFormStep" color="primary" animated header-nav>
    <q-step :name="1" title="House data" icon="description" :done="houseFormStep > 1">
      <q-form @submit="onSubmit" class="q-mt-md">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-4">
            <BaseInput v-model="item.name" label="Name*" validate="text"></BaseInput>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <BaseSelect
              v-model="item.type"
              :options="houseTypes"
              label="Type*"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              validate
            ></BaseSelect>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <BaseSelect
              v-model="item.destination"
              :options="destinationsSelect"
              label="Destinations*"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              validate
              autocomplete
              use-input
              filter
              @filter="filterFn"
            ></BaseSelect>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <BaseInput v-model="item.phone" label="Phone"></BaseInput>
          </div>
          <div class="col-12 col-sm-6 col-md-8">
            <BaseInput v-model="item.address" label="Address"></BaseInput>
          </div>
          <div class="col-12 col-sm-6 col-md-4">
            <BaseInput v-model="item.email" label="Email"></BaseInput>
          </div>
          <div class="col-12 col-md-8">
            <BaseSelect
              v-model="item.features"
              :options="features"
              label="Features"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              use-chips
              multiple
            ></BaseSelect>
          </div>
          <div class="col-12">
            <BaseEditor v-model="item.description"></BaseEditor>
          </div>
        </div>
        <q-stepper-navigation class="tw-text-right">
          <BaseButton
            label="Save & Continue"
            type="submit"
            color="primary"
            class="q-ml-sm"
            :loading="loading"
          />
        </q-stepper-navigation>
      </q-form>
    </q-step>

    <q-step
      :name="2"
      title="Rooms"
      icon="night_shelter"
      :done="houseFormStep > 2"
      :disable="!item.id"
    >
      <FormHouseRoom />
      <q-stepper-navigation>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
          <div>
            <BaseButton
              icon="arrow_back"
              label="Back"
              flat
              color="primary"
              class="q-ml-sm"
              @click="houseFormStep--"
            />
          </div>
          <div class="tw-flex tw-align-middle tw-justify-end">
            <BaseButton
              icon-right="arrow_forward"
              label="Next"
              flat
              color="primary"
              class="q-ml-sm"
              @click="houseFormStep++"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>

    <q-step :name="3" title="Seasons" icon="thermostat" :disable="!item.id">
      <FormHouseSeason />
      <q-stepper-navigation>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
          <div>
            <BaseButton
              icon="arrow_back"
              label="Back"
              flat
              color="primary"
              class="q-ml-sm"
              @click="houseFormStep--"
            />
          </div>
          <div class="tw-flex tw-align-middle tw-justify-end">
            <BaseButton label="Back To The List" class="q-ml-sm" @click="cancel" />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>
