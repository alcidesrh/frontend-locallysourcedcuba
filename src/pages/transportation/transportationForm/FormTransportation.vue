<script lang="ts">
import useTransportation from 'src/pages/transportation/transportationService';
import useLocation from 'src/pages/location/locationService';
import useDriver from 'src/pages/driver/driverService';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

import FormTransportationPrice from './FormTransportationPrice.vue';
import FormTransportationRoute from './FormTransportationRoute.vue';

export default defineComponent({
  setup() {
    const { item, transportationFormStep } = useTransportation();

    transportationFormStep.value = 1

    const { locations, lazyList } = useLocation();

    if (!locations.value.length) {
      const { getLocations } = lazyList();
      getLocations();
    }

    const { drivers, lazyList: driverLazyList } = useDriver();

    if (!drivers.value.length) {
      const { getDrivers } = driverLazyList();
      getDrivers();
    }

    const router = useRouter();
    return {
      item,
      locations,
      drivers,
      transportationFormStep,
      cancel() {
        void router.push({ name: 'ListTransportation' });
        item.value = {};
      },
    };
  },
  components: { FormTransportationPrice, FormTransportationRoute },
  props: ['loading'],
  emits: ['submit'],
  methods: {
    onSubmit() {
      this.$emit('submit');
    },
  },
});
</script>


<template>
  <q-stepper v-model="transportationFormStep" color="primary" animated header-nav>
    <q-step
      :name="1"
      title="Transportation data"
      icon="description"
      :done="transportationFormStep > 1"
    >
      <q-form @submit="onSubmit" class="q-mt-md">
        <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
          <div>
            <BaseInput v-model="item.name" label="Name"></BaseInput>
          </div>
          <div>
            <BaseSelect
              v-model="item.driver"
              :options="drivers"
              label="Driver"
              option-label="name"
              option-value="id"
              emit-value
              map-options
              validate
            ></BaseSelect>
          </div>
          <div
            class="sm:tw-col-span-2 lg:tw-col-span-1 tw-flex tw-items-center tw-justify-end lg:tw-justify-start"
          >
            <BaseButton
              label="Save & Continue"
              type="submit"
              color="primary"
              class="q-ml-sm"
              :loading="loading"
            />
          </div>
        </div>
      </q-form>

      <q-stepper-navigation v-if="item.id">
        <div class="tw-flex tw-align-middle tw-justify-end">
          <BaseButton
            flat
            label="Next"
            color="primary"
            class="q-ml-sm"
            @click="transportationFormStep++"
            icon-right="arrow_forward"
          />
        </div>
      </q-stepper-navigation>
    </q-step>

    <q-step
      :name="2"
      title="Prices"
      icon="price_check"
      :done="transportationFormStep > 2"
      :disable="!item.id"
    >
      <FormTransportationPrice />
      <q-stepper-navigation>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
          <div>
            <BaseButton
              flat
              icon="arrow_back"
              label="Back"
              color="primary"
              class="q-ml-sm"
              @click="transportationFormStep--"
            />
          </div>
          <div class="tw-flex tw-align-middle tw-justify-end">
            <BaseButton
              flat
              icon-right="arrow_forward"
              label="Next"
              color="primary"
              class="q-ml-sm"
              @click="transportationFormStep++"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>

    <q-step :name="3" title="Route" icon="alt_route" :disable="!item.id">
      <FormTransportationRoute />
      <q-stepper-navigation>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
          <div>
            <BaseButton
              flat
              icon="arrow_back"
              label="Back"
              color="primary"
              class="q-ml-sm"
              @click="transportationFormStep--"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>
