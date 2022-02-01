<script lang="ts">
import { defineComponent, ref } from 'vue';
import dayjs from 'dayjs';

export default defineComponent({
  props: {
    transfer: {
      type: Object,
      required: true,
    },
  },
  emits: ['edit', 'remove', 'updateNotification'],
  setup() {
    const dialog = ref(true);

    return {
      dialog,
      remove() {
        dialog.value = false;
      },
      formatDate(date: string | undefined | null) {
        if (date) return dayjs(date).format('DD/MM/YYYY');
        return '';
      },
    };
  },
});
</script>

<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6 tw-mr-2">Transfer {{transfer.type}}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="row items-center q-pb-none"></q-card-section>

      <q-card-section style="min-width: 560px; min-height: 190px">
        <div>
          <div class="row">
            <div class="col-12 tw-mb-2 tw-flex tw-justify-between tw-items-center">
              <div>
                <span class="tw-font-semibold tw-text-gray-500">Tour code:</span>
                <span
                  class="tw-ml-2 tw-text-gray-700 tw-font-semibold"
                >{{transfer.bookingIn ? transfer.bookingIn.tour.code : transfer.bookingOut.tour.code}}</span>
              </div>
              <div>
                <span>
                  <q-icon
                    style="border-radius: 50px; font-size: 20px;"
                    class="tw-mx-1 tw-p-1 tw-cursor-pointer"
                    :class="{'tw-text-gray-700': !transfer.flightData, 'text-teal': transfer.flightData}"
                    name="flight"
                  ></q-icon>
                  <q-icon
                    style="border-radius: 50px; font-size: 20px;"
                    class="tw-mx-1 tw-p-1 tw-cursor-pointer"
                    :class="{'tw-text-gray-700': !transfer.houses.length, 'text-teal': transfer.houses.length}"
                    name="home"
                  />
                  <q-icon
                    name="email"
                    style="border-radius: 50px; font-size: 20px;"
                    class="tw-mx-1 tw-p-1 tw-cursor-pointer"
                    :class="{'tw-text-gray-500': !transfer.sent, 'text-teal': transfer.sent}"
                  />
                </span>
              </div>
            </div>

            <div class="col-12 tw-mb-2">
              <span class="tw-font-semibold tw-text-gray-500">Booking Contact:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{transfer.contact}}</span>
              <span class="tw-font-semibold tw-text-gray-500 tw-ml-3">Pax.N:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{transfer.persons}}</span>
            </div>

            <div class="col-12 tw-mb-2">
              <span class="tw-font-semibold tw-text-gray-500">Date:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{formatDate(transfer.date)}}</span>
              <span class="tw-font-semibold tw-text-gray-500 tw-ml-3">Hour:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{transfer.hour}}</span>
              <span class="tw-font-semibold tw-text-gray-500 tw-ml-3">Fly data:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{transfer.flightData}}</span>
            </div>

            <div class="col-12 tw-mb-2">
              <span class="tw-font-semibold tw-text-gray-500">Destination:</span>
              <span
                class="tw-ml-2 tw-text-gray-700 tw-font-semibold"
              >{{transfer?.destination?.name}}</span>
              <span class="tw-font-semibold tw-text-gray-500 tw-ml-3">Price:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{transfer.price}}</span>
              <span class="tw-font-semibold tw-text-gray-500 tw-ml-3">Drive:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{transfer.drive?.name}}</span>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


