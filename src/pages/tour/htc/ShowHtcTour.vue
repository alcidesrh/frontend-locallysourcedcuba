<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { error } from 'src/helpers/notification';
import { Tour } from 'src/graphql/@types/types';
import dayjs from 'dayjs';
import { cloneDeep } from '@apollo/client/utilities';

export default defineComponent({
  props: {
    id: String,
  },
  emits: ['edit', 'remove', 'updateNotification', 'updateTour'],
  setup(props: Record<string, unknown>, { emit }) {
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
            startPlace
            finishPlace
            startDate
            description
            canceled
            activities {
              id
              name
            }
            notifications {
              id
              icon
              complete
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

    return {
      tour,
      dialog,
      loading,
      formatDate(date: string | undefined | null) {
        if (date) return dayjs(date).format('DD/MM/YYYY');
        return '';
      },
      remove() {
        dialog.value = false;
        emit('remove', tour);
      },
    };
  },
});
</script>

<template>
  <q-dialog v-model="dialog">
    <q-card>
      <q-card-section v-show="!loading" class="row items-center q-pb-none">
        <div class="text-h6 tw-mr-2">{{tour?.code}}</div>
        <q-icon
          @click="$emit('updateTour', tour)"
          class="q-mr-sm"
          :name="tour?.canceled ? 'check_circle' : 'cancel'"
          color="orange"
          style="font-size: 20px; cursor: pointer"
        />
        <q-icon
          @click="$emit('edit', tour?._id)"
          class="q-mr-sm"
          name="edit"
          color="green"
          style="font-size: 20px; cursor: pointer"
        />
        <q-icon
          @click="remove()"
          name="delete"
          color="negative"
          style="font-size: 20px; cursor: pointer"
        />

        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section v-show="!loading" class="row items-center q-pb-none"></q-card-section>

      <q-card-section style="min-width: 560px; min-height: 190px">
        <div v-show="!loading">
          <div class="row">
            <div class="col-12 tw-mb-2 tw-flex tw-justify-between tw-items-center">
              <div>
                <span class="tw-font-semibold tw-text-gray-500">Name:</span>
                <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{tour?.name}}</span>
              </div>
              <div>
                <span v-for="(n, index) in tour?.notifications" :key="index">
                  <q-icon
                    @click.stop="$emit('updateNotification', n);n.complete = !n.complete;"
                    v-if="n"
                    style="border-radius: 50px;"
                    class="tw-mx-1 tw-p-1 tw-text-xl tw-cursor-pointer"
                    :class="{'tw-text-gray-700': !n.complete, 'text-green': n.complete}"
                    :name="n.icon"
                  />
                </span>
              </div>
            </div>
            <div class="col-12 tw-mb-2">
              <span class="tw-font-semibold tw-text-gray-500">Date:</span>
              <span
                class="tw-ml-2 tw-text-gray-700 tw-font-semibold"
              >{{formatDate(tour?.startDate)}}</span>
            </div>
            <div class="col-12 tw-mb-2">
              <span class="tw-font-semibold tw-text-gray-500">Start Place:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{tour?.startDate}}</span>
            </div>
            <div class="col-12 tw-mb-2">
              <span class="tw-font-semibold tw-text-gray-500">End Place:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{tour?.finishPlace}}</span>
            </div>
            <div class="col-12 tw-mb-2">
              <div class="row">
                <div class="col-12">
                  <span class="tw-font-semibold tw-text-gray-500">Activities</span>
                </div>
                <div class="col-12" v-for="(activity, index) in tour?.activities" :key="index">
                  <span class="tw-ml-5 tw-text-gray-700 tw-font-semibold">-{{activity?.name}}</span>
                </div>
              </div>
            </div>
            <div class="col-12 tw-mb-2">
              <div class="row">
                <div class="col-12">
                  <span class="tw-font-semibold tw-text-gray-500">Extra Information</span>
                </div>
                <div class="col-12">
                  <span class="tw-ml-5 tw-text-gray-700 tw-font-semibold">{{tour?.description}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <q-inner-loading :showing="loading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


