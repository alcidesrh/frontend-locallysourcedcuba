<script lang="ts">
import {
  BookingTransfer,
  NotificationTour,
  Tour,
} from 'src/graphql/@types/types';
import { defineComponent, computed, ref, watch, provide } from 'vue';
import useTransfer from './transferService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteTourMutation,
  listTourQuery,
} from 'src/graphql/query/tour.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';
import dayjs from 'dayjs';
import useService from 'src/pages/service/serviceService';
import gql from 'graphql-tag';
import globalLoading from 'src/store/loading';
import { apolloClient } from 'src/boot/apollo';
import ShowTransfer from 'src/pages/transfer/ShowTransfer.vue';
import SearchTransfer from 'src/pages/transfer/SearchTransfer.vue';

export default defineComponent({
  components: { ShowTransfer, SearchTransfer },
  setup() {
    const router = useRouter();
    const $q = useQuasar();

    const transferToShow = ref<Partial<BookingTransfer> | null>(null);

    const refresh = ref(false);

    const { setServiceInUse, service } = useService();

    if (service.value.code != 'transfer') {
      const { getService } = setServiceInUse();
      getService('transfer');
    }

    provide('service', service);

    const { list, items, search, getIncompleteTransfers } = useTransfer();

    const { getTransfer, loading: loadingList } = list();

    const incompleteTransfers = ref<BookingTransfer[]>([]);

    const { onResult: onResultIncompleteTransfers } = getIncompleteTransfers();

    onResultIncompleteTransfers(
      (result: { data: { incompleteBookingTransfers: BookingTransfer[] } }) => {
        incompleteTransfers.value = result.data.incompleteBookingTransfers;
      }
    );

    const startDate = ref('');
    const {
      mutate: deleteTour,
      onError,
      onDone,
      loading: loadingDelete,
    } = useMutation(deleteTourMutation, () => ({
      update: (
        cache,
        {
          data: {
            deleteTour: {
              tour: { id },
            },
          },
        }
      ) => {
        cache.writeQuery({
          query: listTourQuery,
          variables: { ...search.value },
          data: {
            listTours: items.value,
          },
        });
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    onDone(() => {
      success({ message: 'The item have been deleted.' });
    });

    watch(
      [loadingList, loadingDelete],
      ([val, val2]) => (globalLoading.value = val || val2)
    );

    if (!items.value.length) getTransfer();
    else {
      const data: Record<string, []> | null = apolloClient.cache.readQuery({
        query: listTourQuery,
        variables: search.value,
      });
      if (data) items.value = data.listTours;
    }

    const {
      mutate: updateNotificationTourMutation,
      onError: onErrorNotificationState,
    } = useMutation(
      gql`
        mutation updateNotificationTourMutation(
          $input: updateNotificationTourInput!
        ) {
          updateNotificationTour(input: $input) {
            notificationTour {
              id
              complete
            }
          }
        }
      `
    );

    onErrorNotificationState((e: Error) => {
      error(e);
    });

    const menuStates = ref(Array.from({ length: 3 }, () => false));

    return {
      transferToShow,
      refresh,
      service,
      loadingList,
      transfers: computed(() => {
        let transfers = [];
        items.value.forEach((e) => {
          const startDate = dayjs(e.date as string).format('MM/DD/YYYY');
          if (!transfers[startDate]) {
            transfers[startDate] = [];
          }
          (transfers[startDate] as Partial<BookingTransfer>[]).push(e);
        });
        return transfers;
      }),
      edit(id: string) {
        void router.push({
          name: 'EditHtcTour',
          params: { id: id },
        });
      },
      remove(data: Tour) {
        if (loadingDelete.value) return;
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this item?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          startDate.value = data.startDate as string;
          void deleteTour({ input: { id: data.id } });
        });
      },
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
          '<span class="tw-text-gray-500">Showing </span> ' +
          `${
            dayjs(search.value.to || new Date()).diff(
              search.value.from || new Date(),
              'day'
            ) || (service.value.daysToShow as number)
          }` +
          '<span class="tw-text-gray-500"> days. From</span> ' +
          from +
          ' <span class="tw-text-gray-500">to</span> ' +
          to
        );
      }),
      updateNotification(n: NotificationTour) {
        void updateNotificationTourMutation({
          input: { id: n.id, complete: !n.complete },
        });
      },
      show(transfer: BookingTransfer) {
        transferToShow.value = transfer;
        refresh.value = !refresh.value;
      },
      menu: computed(() =>
        ['flight', 'home', 'email'].map((e, i) => {
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
      setMenuState: (i: number) => {
        menuStates.value = Array.from({ length: 3 }, () => false);
        menuStates.value[i] = true;
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <q-card class="tw-mt-0 tw-flex tw-items-center tw-p-5">
      <div class="row tw-w-full">
        <div class="col-12 tw-flex tw-items-center tw-justify-end tw-mb-5 tw-md-0">
          <q-btn
            size="md"
            dense
            flat
            @mouseover="setMenuState(i)"
            v-for="n,i in menu"
            :key="n"
            :icon="n.icon"
            :class="{'tw-text-red-500': n.notificationsPending.length, 'tw-text-green-500': !n.notificationsPending.length}"
            class="tw-text-2xl tw-cursor-pointer tw-mx-1"
          >
            <q-badge
              color="orange"
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
        <div class="col-12">
          <SearchTransfer v-if="service.code" />
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
                    v-for="transfer in transfers[key]"
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
    @update-notification="updateNotification"
  />
</template>
