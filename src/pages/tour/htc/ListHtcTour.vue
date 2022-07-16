<script lang="ts">
import { NotificationTour, Tour } from 'src/graphql/@types/types';
import { defineComponent, computed, provide, ref, watch } from 'vue';
import useTour from './htcTourService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteTourMutation,
  listTourQuery,
} from 'src/graphql/query/tour.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import SearchTour from 'src/pages/tour/components/SearchTour.vue';
import useService from 'src/pages/service/serviceService';
import tourService from 'src/pages/tour/tourService';
import ShowHtcTour from 'src/pages/tour/htc/ShowHtcTour.vue';
import gql from 'graphql-tag';
import globalLoading from 'src/store/loading';
import { cache } from 'src/boot/apollo';
import PendingNotificationTour from 'src/pages/tour/components/PendingNotificationTour.vue';
import { cloneDeep } from 'lodash-es';
import { useNotifications } from 'src/pages/notification/notificationService';

export default defineComponent({
  components: {
    SearchTour,
    ShowHtcTour,
    PendingNotificationTour,
  },
  setup() {
    dayjs.extend(customParseFormat);
    const router = useRouter();
    const $q = useQuasar();

    const { list, items, search, templates, getTemplates } = useTour();

    const { getTours, loading: loadingList } = list();

    const { getNotificationsTour } = tourService();

    const {
      refetch: refetchPendingNotifications,
      load: loadPendingNotifications,
      onResult: onResultPendingNotifications,
    } = getNotificationsTour();

    onResultPendingNotifications(() => {
      if (!items.value.length) getTours();
    });

    if (items.value.length) {
      const data: Record<string, []> | null = cache.readQuery({
        query: listTourQuery,
        variables: search.value,
      });
      if (data) items.value = cloneDeep(data.listTours);
    }

    const { getNotifications } = useNotifications();
    getNotifications('htc');

    const { setServiceInUse, service } = useService();

    watch(
      () => service.value.code,
      () => {
        loadPendingNotifications();
      }
    );

    const { getService } = setServiceInUse();
    getService('htc');

    provide('service', service);

    provide('search', search);

    if (!templates.value.length) getTemplates();

    provide('templates', templates);

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
        items.value = items.value.filter((e: Partial<Tour>) => e.id != id);

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

    provide('getTours', getTours);
    provide('loading', loadingList);

    const {
      mutate: updateNotificationTourMutation,
      onError: onErrorNotificationState,
      onDone: onDoneUpdateNotificationTour,
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

    onDoneUpdateNotificationTour(() => {
      void refetchPendingNotifications();
    });

    onErrorNotificationState((e: Error) => {
      error(e);
    });

    const { mutate: updateTourMutation, onError: onErrorUpdateTourMutation } =
      useMutation(
        gql`
          mutation updateHtcTourMutation($input: updateTourInput!) {
            updateTour(input: $input) {
              tour {
                id
                canceled
                color
              }
            }
          }
        `
      );

    onErrorUpdateTourMutation((e: Error) => {
      error(e);
    });

    const tours = computed(() => {
      let tours = [];
      items.value.forEach((e) => {
        const startDate = dayjs(e.startDate as string).format('MM/DD/YYYY');
        if (!tours[startDate]) {
          tours[startDate] = [];
        }
        (tours[startDate] as Partial<Tour>[]).push(e);
      });
      return tours;
    });

    return {
      id: ref<string | null>(null),
      refreshView: ref(false),
      service,
      tours,
      loadingList,
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
          '<span class="tw-text-gray-700">Showing </span> ' +
          `${dayjs(to, 'DD/MM/YYYY').diff(dayjs(from, 'DD/MM/YYYY'), 'day')}` +
          '<span class="tw-text-gray-700"> days. From</span> ' +
          from +
          ' <span class="tw-text-gray-700">to</span> ' +
          to
        );
      }),
      updateNotification(n: NotificationTour) {
        void updateNotificationTourMutation({
          input: { id: n.id, complete: !n.complete },
        });
        n.complete = !n.complete;
        cache.writeQuery({
          query: listTourQuery,
          variables: { ...search.value },
          data: {
            listTours: items.value,
          },
        });
      },
      updateTour(t: Tour) {
        void updateTourMutation({
          input: { id: t.id, canceled: !t.canceled },
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <q-card flat class="tw-mt-0 tw-flex tw-items-center tw-p-5">
      <div class="tw-absolute tw-top-1 tw-right-1">
        <PendingNotificationTour edit-route="EditHtcTour" />
      </div>
      <div class="row tw-w-full tw-mt-5">
        <div class="col-12 tw-flex tw-items-center">
          <SearchTour v-if="service.code == 'htc'" />
        </div>
      </div>
    </q-card>
    <div class="tw-flex tw-justify-end tw-items-center" v-if="service.daysToShow">
      <div class="tw-font-semibold tw-text-gray-700" v-html="showing"></div>
      <BaseButton
        label="Create Tour"
        icon="add"
        type="button"
        color="primary"
        class="q-ml-sm tw-ml-5"
        @click="$router.push({name: 'CreateHtcTour'})"
      />
    </div>
    <q-list class="tw-mt-5">
      <div v-for="(key, index) in Object.keys(tours)" :key="index">
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
                  <span v-for="tour in tours[key]" :key="tour.id">
                    <q-chip class="tw-mr-2 tw-py-3 tw-my-2" :style="{backgroundColor: tour.color}">
                      <div
                        v-if="tour.canceled"
                        style="left: -8px; top:-9px; background: whitesmoke;"
                        class="tw-text-xs tw-transform tw--rotate-12 tw-font-bold tw-uppercase tw-text-red-700 tw-border tw-border-red-700 tw-absolute"
                      >Canceled</div>
                      <div class="tw-p-0 tw-font-semibold tw-text-white tw-flex tw-items-center">
                        <label
                          @click.stop="refreshView = !refreshView; id = tour.id"
                          class="tw-bg-gray-700 tw-tracking-widest tw-cursor-pointer"
                          style="border-radius: 50px; padding: 0px 10px;"
                        >{{tour.code}}</label>
                        <span class="tw-ml-3">
                          <q-icon
                            @click.stop="updateNotification(n)"
                            style="border-radius: 50px; font-size: 15px;"
                            class="tw-mx-1 tw-bg-gray-100 tw-p-1 tw-cursor-pointer"
                            :class="{'tw-text-gray-500': !n.complete, 'text-teal': n.complete}"
                            v-for="(n, index) in tour.notifications"
                            :key="index"
                            :name="n.icon"
                          />
                        </span>

                        <span
                          class="tw-ml-5 tw-bg-white tw-tracking-widest"
                          style="border-radius: 50px; padding: 0px 10px;"
                        >
                          <q-icon
                            @click.stop="refreshView = !refreshView; id = tour.id"
                            class="q-mr-sm"
                            name="visibility"
                            color="blue"
                            style="font-size: 20px; cursor: pointer"
                          >
                            <q-tooltip
                              class="bg-indigo"
                              anchor="top middle"
                              self="bottom middle"
                              :offset="[10, 10]"
                            >
                              <div class="tw-text-bassde">Show Tour Info</div>
                            </q-tooltip>
                          </q-icon>
                          <q-icon
                            @click.stop="edit(tour._id)"
                            class="q-mr-sm"
                            name="edit"
                            color="teal"
                            style="font-size: 20px; cursor: pointer"
                          />
                          <q-icon
                            @click.stop="updateTour(tour)"
                            class="q-mr-sm"
                            :name="tour?.canceled ? 'check_circle' : 'cancel'"
                            color="orange"
                            style="font-size: 20px; cursor: pointer"
                          >
                            <q-tooltip
                              class="bg-orange"
                              anchor="top middle"
                              self="bottom middle"
                              :offset="[10, 10]"
                            >
                              <div
                                class="tw-text-sm"
                                v-text="tour.canceled ? 'Activate Tour' : 'Cancel Tour'"
                              ></div>
                            </q-tooltip>
                          </q-icon>

                          <q-icon
                            @click.stop="remove(tour)"
                            name="delete"
                            color="negative"
                            style="font-size: 20px; cursor: pointer"
                          />
                        </span>
                      </div>
                    </q-chip>
                    <q-tooltip>
                      <div class="tw-text-base tw-font-black">{{tour.name}}</div>
                      <div v-if="tour.guide" class="tw-text-sm">
                        Guide:
                        <span class="tw-font-semibold">{{tour.guide.name}}</span>
                      </div>
                    </q-tooltip>
                  </span>
                </div>
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-separator spaced inset />
      </div>

      <div
        v-if="!Object.keys(tours).length && !loadingList"
        class="tw-p-10 tw-text-center tw-text-gray-400 tw-font-semibold tw-text-md"
      >
        <label>No result found</label>
      </div>
    </q-list>
  </q-page>
  <ShowHtcTour
    v-if="id"
    :id="id"
    :key="refreshView"
    @edit="edit"
    @remove="remove"
    @update-notification="updateNotification"
    @update-tour="updateTour"
  />
</template>
