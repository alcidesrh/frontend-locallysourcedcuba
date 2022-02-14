<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { error } from 'src/helpers/notification';
import { ItineraryDay, Tour } from 'src/graphql/@types/types';
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

    return {
      tour,
      dialog,
      loading,
      dayjs,
      formatDate(date: string | undefined | null) {
        if (date) return dayjs(date).format('DD/MM/YYYY');
        return '';
      },
      remove() {
        dialog.value = false;
        emit('remove', tour);
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
    };
  },
});
</script>

<template>
  <q-dialog v-model="dialog">
    <q-card style="min-width: 750px;">
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
          @click="$emit('edit',{id: tour?._id})"
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

      <q-card-section style="min-height: 190px" class="tw-px-10">
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
                    :class="{'tw-text-gray-700': !n.complete, 'text-teal': n.complete}"
                    :name="n.icon"
                  />
                </span>
              </div>
            </div>
            <div class="col-12 tw-mb-2">
              <span class="tw-font-semibold tw-text-gray-500">Start Date:</span>
              <span
                class="tw-ml-2 tw-text-gray-700 tw-font-semibold"
              >{{formatDate(tour?.startDate)}}</span>
            </div>
            <div class="col-12 tw-mb-2">
              <span class="tw-font-semibold tw-text-gray-500">End Date:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{formatDate(tour?.endDate)}}</span>
            </div>
            <div class="col-12 tw-mb-2">
              <span class="tw-font-semibold tw-text-gray-500">Start Day:</span>
              <span
                class="tw-ml-2 tw-text-gray-700 tw-font-semibold"
              >{{dayjs(dayjs().day(tour?.startDay)).format('dddd')}}</span>
            </div>
            <div class="col-12 tw-mb-2">
              <div class="row">
                <div class="col-12">
                  <span class="tw-font-semibold tw-text-gray-500">Itinerary</span>
                </div>
                <div class="col-12" v-for="(i, index) in tour?.itineraries" :key="index">
                  <q-expansion-item expand-separator>
                    <template #header>
                      <q-item-section avatar class="tw-flex tw-items-center">
                        <q-icon name="horizontal_rule" size="14px" color="primary" />
                      </q-item-section>
                      <q-item-section class="tw-flex">
                        <label
                          class="tw-text-gray-700 tw-font-semibold"
                        >{{formatItinerary(i.itineraryDays)}}</label>
                      </q-item-section>
                    </template>
                    <q-card>
                      <q-card-section>
                        <q-expansion-item
                          v-for="(e,i) in i.itineraryDays"
                          :key="i"
                          expand-separator
                        >
                          <template #header>
                            <q-item-section avatar class="tw-flex tw-items-center">
                              <q-icon
                                name="horizontal_rule"
                                size="14px"
                                color="primary"
                                class="material-icons-outlined"
                              />
                            </q-item-section>
                            <q-item-section class="tw-flex">
                              <label
                                class="tw-text-gray-700 tw-font-semibold"
                              >{{formatItineraryDay(e)}}</label>
                            </q-item-section>
                          </template>
                          <q-card>
                            <q-card-section>
                              <q-item>
                                <q-item-section avatar class="tw-flex tw-items-center"></q-item-section>
                                <q-item-section class="tw-flex">
                                  <div class="tw-font-semibold tw-text-gray-500">Activities:</div>
                                </q-item-section>
                              </q-item>
                              <div v-if="e.activities.length">
                                <q-item v-for="(e,i) in e.activities" :key="i">
                                  <q-item-section avatar class="tw-flex tw-items-center">
                                    <q-icon
                                      name="circle"
                                      size="10px"
                                      color="primary"
                                      class="material-icons-outlined"
                                    />
                                  </q-item-section>
                                  <q-item-section class="tw-flex">
                                    <label class="tw-text-gray-700 tw-font-semibold">{{e.name}}</label>
                                  </q-item-section>
                                </q-item>
                              </div>
                              <q-item v-else>
                                <q-item-section avatar></q-item-section>
                                <q-item-section class="tw-flex">
                                  <label
                                    class="tw-font-semibold tw-text-gray-500"
                                  >There are no activities at this day</label>
                                </q-item-section>
                              </q-item>
                            </q-card-section>
                          </q-card>
                        </q-expansion-item>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </div>
              </div>
            </div>
            <div class="col-12 tw-mb-2" v-if="tour?.transporation">
              <span class="tw-font-semibold tw-text-gray-500">Transportation:</span>
              <span class="tw-ml-2 tw-text-gray-700 tw-font-semibold">{{tour?.transporation.name}}</span>
              <span v-if="tour?.transporation.driver" class="tw-ml-2">
                <span class="tw-font-semibold tw-text-gray-500">Driver:</span>
                <span
                  class="tw-ml-2 tw-text-gray-700 tw-font-semibold"
                >{{tour?.transporation.driver.name}}</span>
              </span>
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
        <BaseLoading :showing="loading" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>


