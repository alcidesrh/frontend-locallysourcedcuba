<script lang="ts">
import { BookingTransfer } from 'src/graphql/@types/types';
import { defineComponent, computed, ref, watch, provide } from 'vue';
import useTransfer from './transferService';
import dayjs from 'dayjs';
import useService from 'src/pages/service/serviceService';
import { apolloClient } from 'src/boot/apollo';
import ShowTransfer from 'src/pages/transfer/ShowTransfer.vue';
import SearchTransfer from 'src/pages/transfer/SearchTransfer.vue';
import {
  updateBookingTransferMutation,
  listBookingTransferQuery,
} from 'src/graphql/query/transfer.graphql';
import { cloneDeep } from '@apollo/client/utilities';

export default defineComponent({
  components: { ShowTransfer, SearchTransfer },
  setup() {
    const transferToShow = ref<Partial<BookingTransfer> | null>(null);

    const refresh = ref(false);

    const { list, items, search, getIncompleteTransfers } = useTransfer();

    const { getTransfer, loading: loadingList } = list();

    const incompleteTransfers = ref<BookingTransfer[]>([]);

    const {
      onResult: onResultIncompleteTransfers,
      getPendingTransfersNotifications,
      loading: loadingNotifications,
    } = getIncompleteTransfers();

    onResultIncompleteTransfers(
      (result: { data: { incompleteBookingTransfers: BookingTransfer[] } }) => {
        incompleteTransfers.value = result.data.incompleteBookingTransfers;
      }
    );

    const { setServiceInUse, service } = useService();

    watch(
      () => service.value.code,
      () => {
        getPendingTransfersNotifications();
      }
    );

    if (service.value.code != 'transfer') {
      const { getService } = setServiceInUse();
      getService('transfer');
    }

    provide('service', service);

    if (!items.value.length) getTransfer();
    else {
      const data: Record<string, []> | null = apolloClient.cache.readQuery({
        query: listBookingTransferQuery,
        variables: search.value,
      });
      if (data) items.value = cloneDeep(data.listBookingTransfers);
    }

    const transfers = computed(() => {
      let transfers = [];
      items.value.forEach((e) => {
        const startDate = dayjs(e.date as string).format('MM/DD/YYYY');
        if (!transfers[startDate]) {
          transfers[startDate] = [];
        }
        (transfers[startDate] as Partial<BookingTransfer>[]).push(e);
      });
      return transfers;
    });

    const menuStates = ref(Array.from({ length: 3 }, () => false));
    return {
      transferToShow,
      refresh,
      service,
      loadingList,
      loadingNotifications,
      transfers,
      dateColumn(date: string) {
        return `<div>${dayjs(date).format('dddd')}</div><div>${dayjs(
          date
        ).format('DD/MM/YYYY')}</div>`;
      },
      showing: computed(() => {
        let from = '',
          to = '';

        if (search.value.from) {
          from = dayjs(search.value.from).format('DD/MM/YYYY');
        } else from = dayjs().format('DD/MM/YYYY');

        if (search.value.to) {
          to = dayjs(search.value.to).format('DD/MM/YYYY');
        } else {
          to = dayjs(search.value.from || new Date())
            .add(service.value.daysToShow || 0, 'day')
            .format('DD/MM/YYYY');
        }

        return (
          '<span class="tw-text-gray-700">Showing </span> ' +
          `${
            dayjs(search.value.to || new Date()).diff(
              search.value.from || new Date(),
              'day'
            ) || (service.value.daysToShow as number)
          }` +
          '<span class="tw-text-gray-700"> days. From</span> ' +
          from +
          ' <span class="tw-text-gray-700">to</span> ' +
          to
        );
      }),
      show(transfer: BookingTransfer) {
        transferToShow.value = transfer;
        refresh.value = !refresh.value;
      },
      menu: computed(() =>
        ['flight_takeoff', 'home', 'email'].map((e, i) => {
          return {
            icon: e,
            notificationsPending: incompleteTransfers.value.filter(
              (n) =>
                (i == 0 && !n.flightData) ||
                (i == 1 && !n.houses?.length) ||
                (i == 2 && !n.sent)
            ),
          };
        })
      ),
      menuStates,
      updateSentNotification(transfer: BookingTransfer, index: number | null) {
        if (!index) index = items.value.indexOf(transfer);
        void apolloClient
          .mutate({
            mutation: updateBookingTransferMutation,
            variables: {
              input: {
                id: transfer.id,
                sent: !transfer.sent,
              },
            },
          })
          .then(() => {
            transfer.sent = !transfer.sent;
            apolloClient.cache.writeQuery({
              query: listBookingTransferQuery,
              data: {
                listBookingTransfers: items.value,
              },
              variables: search.value,
            });
          });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <q-card flat class="tw-mt-0 tw-flex tw-items-center tw-p-5">
      <div class="tw-absolute tw-top-1 tw-right-1" v-if="!loadingNotifications">
        <q-btn
          size="md"
          dense
          flat
          v-for="n,i in menu"
          :key="n"
          :icon="n.icon"
          :class="{'text-orange-8': n.notificationsPending.length, 'text-teal': !n.notificationsPending.length}"
          class="tw-text-2xl tw-cursor-pointer tw-mx-1"
        >
          <q-badge
            color="indigo"
            floating
            v-if="n.notificationsPending.length"
          >{{n.notificationsPending.length}}</q-badge>
          <q-menu v-model="menuStates[i]" v-if="n.notificationsPending.length">
            <q-list style="min-width: 200px" class="tw-py-3">
              <q-item
                class="tw-px-2"
                clickable
                v-close-popup
                v-for="transfer,i in n.notificationsPending"
                :key="i"
                style="min-height: 44px; padding: 4px 12px;"
              >
                <span class="tw-cursor-pointer" @click="show(transfer)">
                  <q-chip
                    class="tw-mr-2 tw-py-3 tw-my-2"
                    :style="{backgroundColor: transfer.tour?.color}"
                  >
                    <div
                      v-if="transfer.canceled"
                      style="left: -8px; top:-9px; background: whitesmoke;"
                      class="tw-text-xs tw-transform tw--rotate-12 tw-font-bold tw-uppercase tw-text-red-700 tw-border tw-border-red-700 tw-absolute"
                    >Canceled</div>
                    <div class="tw-p-0 tw-font-semibold tw-text-white tw-flex tw-items-center">
                      <label
                        class="tw-bg-gray-700 tw-tracking-widest tw-cursor-pointer"
                        style="border-radius: 50px; padding: 0px 10px;"
                      >
                        <q-icon
                          :name="transfer.type == 'In' ? 'flight_land' : 'flight_takeoff'"
                          color="white"
                          style="font-size: 20px"
                        />
                        {{transfer.type}}
                      </label>

                      <span class="tw-ml-3">
                        <q-icon
                          style="border-radius: 50px; font-size: 15px;"
                          class="tw-mx-1 tw-bg-gray-100 tw-p-1 tw-cursor-pointer"
                          :class="{'tw-text-gray-500': !transfer.flightData, 'text-teal': transfer.flightData}"
                          name="flight"
                        ></q-icon>
                        <q-icon
                          style="border-radius: 50px; font-size: 15px;"
                          class="tw-mx-1 tw-bg-gray-100 tw-p-1 tw-cursor-pointer"
                          :class="{'tw-text-gray-500': !transfer.houses?.length, 'text-teal': transfer.houses?.length}"
                          name="home"
                        />
                        <q-icon
                          name="email"
                          style="border-radius: 50px; font-size: 15px;"
                          class="tw-mx-1 tw-bg-gray-100 tw-p-1 tw-cursor-pointer"
                          :class="{'tw-text-gray-500': !transfer.sent, 'text-teal': transfer.sent}"
                        />
                      </span>
                    </div>
                  </q-chip>
                </span>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </div>
      <div class="row tw-w-full">
        <div class="col-12 tw-flex tw-items-center tw-mt-5">
          <SearchTransfer v-if="service.code == 'transfer'" />
        </div>
      </div>
    </q-card>
    <div
      class="tw-text-right tw-pt-5 tw-font-semibold tw-text-gray-700"
      v-if="service.daysToShow"
      v-html="showing"
    ></div>
    <q-list class="tw-mt-5">
      <div v-for="(key, index) in Object.keys(transfers)" :key="index">
        <q-item>
          <q-item-section>
            <div class="row">
              <div class="col tw-flex tw-items-center" style="max-width: 150px;">
                <div
                  class="tw-text-gray-500 tw-font-semibold tw-text-center"
                  v-html="dateColumn(key)"
                ></div>
              </div>
              <div class="col tw-flex tw-items-center">
                <div>
                  <span
                    class="tw-cursor-pointer"
                    v-for="transfer,i in transfers[key]"
                    :key="transfer.id"
                    @click="show(transfer)"
                  >
                    <q-chip
                      class="tw-mr-2 tw-py-3 tw-my-2"
                      :style="{backgroundColor: transfer.bookingIn ? transfer.bookingIn.tour.color : transfer.bookingOut.tour.color}"
                    >
                      <div
                        v-if="transfer.canceled"
                        style="left: -8px; top:-9px; background: whitesmoke;"
                        class="tw-text-xs tw-transform tw--rotate-12 tw-font-bold tw-uppercase tw-text-red-700 tw-border tw-border-red-700 tw-absolute"
                      >Canceled</div>
                      <div class="tw-p-0 tw-font-semibold tw-text-white tw-flex tw-items-center">
                        <label
                          class="tw-bg-gray-700 tw-tracking-widest tw-cursor-pointer"
                          style="border-radius: 50px; padding: 0px 10px;"
                        >
                          <q-icon
                            :name="transfer.type == 'In' ? 'flight_land' : 'flight_takeoff'"
                            color="white"
                            style="font-size: 20px"
                          />
                          {{transfer.type}}
                        </label>

                        <span class="tw-ml-3">
                          <q-icon
                            style="border-radius: 50px; font-size: 15px;"
                            class="tw-mx-1 tw-bg-gray-100 tw-p-1 tw-cursor-pointer"
                            :class="{'tw-text-gray-500': !transfer.flightData, 'text-teal': transfer.flightData}"
                            name="flight"
                          ></q-icon>
                          <q-icon
                            style="border-radius: 50px; font-size: 15px;"
                            class="tw-mx-1 tw-bg-gray-100 tw-p-1 tw-cursor-pointer"
                            :class="{'tw-text-gray-500': !transfer.houses.length, 'text-teal': transfer.houses.length}"
                            name="home"
                          />
                          <q-icon
                            @click.stop="updateSentNotification(transfer, i)"
                            name="email"
                            style="border-radius: 50px; font-size: 15px;"
                            class="tw-mx-1 tw-bg-gray-100 tw-p-1 tw-cursor-pointer"
                            :class="{'tw-text-gray-500': !transfer.sent, 'text-teal': transfer.sent}"
                          />
                        </span>

                        <!-- <span
                          class="tw-ml-5 tw-bg-white tw-tracking-widest"
                          style="border-radius: 50px; padding: 0px 10px;"
                        >
                          <q-icon
                            class="q-mr-sm"
                            name="visibility"
                            color="blue"
                            style="font-size: 20px; cursor: pointer"
                          ></q-icon>
                          <q-icon
                            class="q-mr-sm"
                            name="edit"
                            color="teal"
                            style="font-size: 20px; cursor: pointer"
                          />
                          <q-icon
                            name="delete"
                            color="negative"
                            style="font-size: 20px; cursor: pointer"
                          />
                        </span>-->
                      </div>
                    </q-chip>
                  </span>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-separator spaced inset />
      </div>

      <div
        v-if="!Object.keys(transfers).length && !loadingList"
        class="tw-p-10 tw-text-center tw-text-gray-400 tw-font-semibold tw-text-md"
      >
        <label>No result found</label>
      </div>
    </q-list>
  </q-page>
  <ShowTransfer
    v-if="transferToShow"
    :transfer="transferToShow"
    :key="refresh"
    @edit="edit"
    @remove="remove"
    @update-notification="updateSentNotification"
  />
</template>
