<script lang="ts">
import useLsTour from 'src/pages/tour/ls/lsTourService';
import useService from 'src/pages/service/serviceService';
import FormTourInformation from 'src/pages/tour/ls/lsTourForm/FormTourInformation.vue';
import FormTourNotification from 'src/pages/tour/components/FormTourNotification.vue';
import FormLsTourItinerary from 'src/pages/tour/ls/lsTourForm/FormLsTourItinerary.vue';
import FormTourBooking from 'src/pages/tour/ls/lsTourForm/FormTourBooking.vue';
import { defineComponent, provide } from 'vue';
import useDestination from 'src/pages/destination/destinationService';
import gql from 'graphql-tag';
import useTransportation from 'src/pages/transportation/transportationService';
import useHouseType from 'src/pages/house/houseTypeService';

export default defineComponent({
  setup() {
    let { item, tourFormStep } = useLsTour();

    const { setServiceInUse, service } = useService();

    if (service.value.code != 'ls') {
      const { getService } = setServiceInUse();
      getService('ls');
    }

    provide('item', item);
    provide('service', service);

    tourFormStep.value = 1;

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

    return {
      item,
      tourFormStep,
      service,
    };
  },
  components: {
    FormTourInformation,
    FormTourNotification,
    FormLsTourItinerary,
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

    <q-step :name="2" title="Itinerary" icon="event_note" :disable="!item.id">
      <FormLsTourItinerary />
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
