<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { ItineraryDay, NotificationTour, Tour } from 'src/graphql/@types/types';
import dayjs from 'dayjs';
import { cloneDeep } from '@apollo/client/utilities';
import ShowLsTour from 'src/pages/tour/ls/ShowLsTour.vue';
import ShowHtcTour from 'src/pages/tour/htc/ShowHtcTour.vue';
import { useQuasar } from 'quasar';
import { deleteTourMutation } from 'src/graphql/query/tour.graphql';
import { error, success } from 'src/helpers/notification';

export default defineComponent({
  props: {
    id: String,
    type: String,
  },
  components: {
    ShowLsTour,
    ShowHtcTour,
  },
  setup(props: Record<string, unknown>, { emit }) {
    const $q = useQuasar();
    const dialog = ref(true);
    const tour = ref<Tour>();

    const { onError, onResult, loading } = useQuery(
      gql`
        query getTour($id: ID!) {
          tour(id: $id) {
            id
            _id
            name
            code
            color
            startDate
            endDate
            startDay
            description
            canceled
            days
            notifications {
              id
              icon
              complete
            }
            itineraries {
              days
              destination {
                name
              }
              itineraryDays {
                activities {
                  name
                }
                day
                date
              }
            }
            transportation {
              name
              driver {
                name
              }
            }
          }
        }
      `,
      () => ({
        id: props.id,
      }),
      {
        fetchPolicy: 'network-only',
      }
    );
    onError((e: Error) => {
      error(e);
    });

    onResult((result: { data: { tour: Tour } }) => {
      tour.value = cloneDeep(result.data.tour);
    });

    const { mutate: updateNotificationTourMutation } = useMutation(
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

    const {
      mutate: updateTourMutation,
      onDone: onDoneUpdateTour,
      onError: onErrorUpdateTour,
    } = useMutation(
      gql`
        mutation updateTourMutation($input: updateTourInput!) {
          updateTour(input: $input) {
            tour {
              id
            }
          }
        }
      `
    );

    onErrorUpdateTour((e: Error) => {
      error(e);
    });

    onDoneUpdateTour(() => {
      emit('refetch');
      emit('refetchtoursWithoutGuide');
      success({ message: 'Guide removed from that tour.' });
    });

    const {
      mutate: deleteTour,
      onError: onErrorDelete,
      onDone: onDoneDelete,
    } = useMutation(deleteTourMutation);

    onErrorDelete((e: Error) => {
      error(e);
    });

    onDoneDelete(() => {
      emit('refetch');
      success({ message: 'The item have been deleted.' });
    });

    const {
      mutate: cancelTourMutation,
      onError: onErrorCancelTourMutation,
      onDone: onDoneCancelTour,
    } = useMutation(
      gql`
        mutation updateLsTourMutation($input: updateTourInput!) {
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

    onErrorCancelTourMutation((e: Error) => {
      error(e);
    });
    onDoneCancelTour(() => {
      emit('refetch');
    });
    return {
      tour,
      dialog,
      loading,
      dayjs,
      formatDate(date: string | undefined | null) {
        if (date) return dayjs(date).format('DD/MM/YYYY');
        return '';
      },
      formatItinerary(i: ItineraryDay[]) {
        let output = '';
        let month = '';
        i.forEach((e) => {
          if (!month) {
            month = dayjs(e.date as string).format('MMMM');
            output = dayjs(e.date as string).format('D');
          } else if (month != dayjs(e.date as string).format('MMMM')) {
            output = output + ' of ' + month;
            month = dayjs(e.date as string).format('MMMM');
            output = output + '; ' + dayjs(e.date as string).format('D');
          } else output = output + ', ' + dayjs(e.date as string).format('D');
        });

        output = output + ' of ' + month;

        return output;
      },
      formatItineraryDay(i: ItineraryDay) {
        return (
          dayjs(i.date as string).format('D') +
          ' ' +
          dayjs(i.date as string).format('dddd') +
          ', ' +
          dayjs(i.date as string).format('MMMM')
        );
      },
      updateNotification(n: NotificationTour) {
        void updateNotificationTourMutation({
          input: { id: n.id, complete: !n.complete },
        });
        n.complete = !n.complete;
        // cache.writeQuery({
        //   query: listTourQuery,
        //   variables: { ...search.value },
        //   data: {
        //     listTours: items.value,
        //   },
        // });
      },
      remove(data: Tour) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this item?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          // startDate.value = data.startDate as string;
          void deleteTour({ input: { id: data.id } });
        });
      },
      updateTour(t: Tour) {
        void cancelTourMutation({
          input: { id: t.id, canceled: !t.canceled },
        });
      },
      removeGuideFromTour() {
        void updateTourMutation({ input: { id: tour.value?.id, guide: null } });
        emit('close');
      },
    };
  },
});
</script>

<template>
  <ShowLsTour
    v-if="id && type == 'ls'"
    :id="id"
    @edit="(id) => $router.push({
          name: 'EditLsTour',
          params: { id: id },
        })"
    @remove="remove"
    @update-notification="updateNotification"
    @update-tour="updateTour"
  >
    <template v-slot:remove-guide>
      <BaseButton
        label="Remove from this guide"
        type="button"
        color="primary"
        class="q-ml-sm"
        @click="removeGuideFromTour"
      />
    </template>
  </ShowLsTour>
  <ShowHtcTour
    v-else-if="id"
    :id="id"
    @edit="(id) => $router.push({
          name: 'EditHtcTour',
          params: { id: id },
        })"
    @remove="remove"
    @update-notification="updateNotification"
    @update-tour="updateTour"
  >
    <template v-slot:remove-guide>
      <BaseButton
        label="Remove from this guide"
        type="button"
        color="primary"
        class="q-ml-sm"
        @click="removeGuideFromTour"
      />
    </template>
  </ShowHtcTour>
</template>


