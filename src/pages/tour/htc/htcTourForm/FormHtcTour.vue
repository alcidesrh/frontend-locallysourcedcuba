<script lang="ts">
import useHtcTour from 'src/pages/tour/htc/htcTourService';
import useService from 'src/pages/service/serviceService';
import FormTourInformation from 'src/pages/tour/htc/htcTourForm/FormTourInformation.vue';
import FormTourNotification from 'src/pages/tour/components/FormTourNotification.vue';
import FormHtcTourActivity from 'src/pages/tour/htc/htcTourForm/FormHtcTourActivity.vue';
import FormTourBooking from 'src/pages/tour/components/FormTourBooking.vue';
import { defineComponent, provide } from 'vue';

export default defineComponent({
  setup() {
    let { item, tourFormStep, list } = useHtcTour();

    const { loadTours } = list();

    provide('loadTours', loadTours);

    const { getServiceInUse, service } = useService();

    if (service.value.code != 'htc') {
      getServiceInUse('htc');
    }

    provide('item', item);
    provide('service', service);

    tourFormStep.value = 1;

    return {
      item,
      tourFormStep,
      service,
    };
  },
  components: {
    FormTourInformation,
    FormTourNotification,
    FormHtcTourActivity,
    FormTourBooking,
  },
});
</script>

<template >
  <q-stepper v-model="tourFormStep" color="primary" animated header-nav>
    <q-step :name="1" title="Tour Data" icon="description">
      <FormTourInformation />
      <q-stepper-navigation v-if="item.id">
        <div class="tw-mb-5 tw-mt-2">
          <div class="tw-flex tw-align-middle tw-justify-end">
            <BaseButton
              icon-right="arrow_forward"
              label="Next"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourFormStep++"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>

    <q-step :name="2" title="Activities" icon="local_activity" :disable="!item.id">
      <FormHtcTourActivity />
      <q-stepper-navigation>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
          <div>
            <BaseButton
              icon="arrow_back"
              label="Back"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourFormStep--"
            />
          </div>
          <div class="tw-flex tw-align-middle tw-justify-end">
            <BaseButton
              icon-right="arrow_forward"
              label="Next"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourFormStep++"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>

    <q-step :name="3" title="Bookings" icon="groups" :disable="!item.id">
      <FormTourBooking />
      <q-stepper-navigation>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
          <div>
            <BaseButton
              icon="arrow_back"
              label="Back"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourFormStep--"
            />
          </div>
          <div class="tw-flex tw-align-middle tw-justify-end">
            <BaseButton
              icon-right="arrow_forward"
              label="Next"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourFormStep++"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>

    <q-step :name="4" title="Notifications" icon="notifications_active" :disable="!item.id">
      <FormTourNotification v-if="service.code" />
      <q-stepper-navigation>
        <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
          <div>
            <BaseButton
              icon="arrow_back"
              label="Back"
              flat
              color="primary"
              class="q-ml-sm"
              @click="tourFormStep--"
            />
          </div>
        </div>
      </q-stepper-navigation>
    </q-step>
  </q-stepper>
</template>
