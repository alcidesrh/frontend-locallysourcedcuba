<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import {
  createItineraryMutation,
  updateItineraryMutation,
  deleteItineraryMutation,
  createItineraryDayMutation,
  updateItineraryDayMutation,
} from 'src/graphql/query/itinerary.graphql';
import lsTourService from 'src/pages/tour/ls/lsTourService';
import useDestination from 'src/pages/destination/destinationService';
import useHouse from 'src/pages/house/houseService';
import { useQuasar } from 'quasar';
import { Itinerary, House, ItineraryDay } from 'src/graphql/@types/types';
import { housesQuery } from 'src/graphql/query/house.graphql';
import { cloneDeep } from 'lodash-es';
import { apolloClient } from 'src/boot/apollo';
import useActivity from 'src/pages/activity/activityService';
import globalLoading from 'src/store/loading';

export default defineComponent({
  setup() {
    const $q = useQuasar();

    let { item } = lsTourService();

    let { destinations } = useDestination();

    const { getHouseByDestination } = useHouse();

    const {
      getHouses,
      onResult: onResultHouse,
      loading: loadingHouse,
    } = getHouseByDestination();

    const form = ref<null | Record<string, () => void>>(null);

    const houses = ref<Partial<House>[]>([]);

    onResultHouse(
      (result: {
        data: {
          houses: Partial<House>[];
        };
      }) => {
        houses.value = result.data.houses;
      }
    );

    const { items: activities, list } = useActivity();

    if (!activities.value.length) {
      const { getActivities } = list();
      getActivities();
    }

    const itinerary = ref<Partial<Itinerary>>({});

    const itineraries = ref<Partial<Itinerary>[]>([]);

    let expand = ref<(false | number)[]>([]);

    if (
      typeof item.value.itineraries != 'undefined' &&
      item.value.itineraries?.length
    ) {
      itineraries.value = cloneDeep(
        item.value.itineraries
      ) as Partial<Itinerary>[];

      expand.value = Array.from(
        { length: itineraries.value.length },
        () => false
      );
    }

    watch(
      () => itinerary.value.destination,
      (newVal, oldVal) => {
        houses.value = [];
        if (oldVal) itinerary.value.house = null;
        if (newVal) {
          const data = apolloClient.readQuery({
            query: housesQuery,
            variables: {
              destinationID: itinerary.value.destination?.id,
            },
          }) as Record<string, []>;
          if (data && data.houses && data.houses.length)
            houses.value = data.houses;
          else
            getHouses(housesQuery, {
              destinationID: itinerary.value.destination?.id,
            });
        }
      }
    );

    const {
      mutate: createItinerary,
      loading: loadingCreate,
      onError: onErrorCreate,
    } = useMutation(createItineraryMutation, () => ({
      update: async (
        cache,
        {
          data: {
            createItinerary: {
              itinerary: { id },
            },
          },
        }
      ) => {
        expand.value.push(false);

        let cont = itineraries.value.reduce((v, v2) => {
          if (v2.days) v = v + v2.days;
          return v;
        }, 0);
        if (itinerary.value.days) {
          itinerary.value.itineraryDays = [];
          for (let i = 1; i <= itinerary.value.days; i++) {
            await createItineraryDay({
              input: { day: i + cont, itinerary: id as string },
            });
          }
        }
        itineraries.value.push({ ...itinerary.value, id: id as string });
        itinerary.value = {};
        item.value.itineraries = itineraries.value as Itinerary[];

        if (form.value) {
          form.value.resetValidation();
        }
      },
    }));

    onErrorCreate((e: Error) => {
      error(e);
    });

    const {
      mutate: updateItinerary,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateItineraryMutation, () => ({
      update: () => {
        const el = itineraries.value.find(
          (e: Partial<Itinerary>) => e && e.id == itinerary.value.id
        );
        if (el)
          itineraries.value[itineraries.value.indexOf(el)] = itinerary.value;
        itinerary.value = {};
        item.value.itineraries = itineraries.value as Itinerary[];

        if (form.value) {
          form.value.resetValidation();
        }
      },
    }));

    onErrorUpdate((e: Error) => {
      error(e);
    });

    const {
      mutate: deleteItinerary,
      loading: loadingDelete,
      onError: onErrorDelete,
    } = useMutation(deleteItineraryMutation, () => ({
      update: (
        cache,
        {
          data: {
            deleteItinerary: {
              itinerary: { id },
            },
          },
        }
      ) => {
        if (itineraries.value) {
          item.value.itineraries = itineraries.value = (
            itineraries.value as Itinerary[]
          ).filter((r: Itinerary) => r.id != id);
        }
      },
    }));
    onErrorDelete((e: Error) => {
      error(e);
    });

    const { mutate: createItineraryDay, loading: loadingDayCreate } =
      useMutation(createItineraryDayMutation, () => ({
        update: (
          cache,
          {
            data: {
              createItineraryDay: { itineraryDay },
            },
          }
        ) => {
          itinerary.value.itineraryDays?.push(itineraryDay);
        },
      }));

    const { mutate: updateItineraryDay } = useMutation(
      updateItineraryDayMutation
    );

    watch(
      [loadingCreate, loadingUpdate, loadingDelete, loadingDayCreate],
      ([v, v2, v3, v4]) => (globalLoading.value = v || v2 || v3 || v4)
    );
    return {
      loadingHouse,
      activities,
      destinations,
      itinerary,
      itineraries,
      houses,
      form,
      expand,
      addItinerary() {
        const param = {
          input: [itinerary.value].map((e: Partial<Itinerary>) => {
            return {
              ...itinerary.value,
              tour: item.value.id,
              destination: e.destination?.id,
              house: e.house?.id || null,
            };
          })[0],
        };
        if (itinerary.value.id) {
          void updateItinerary(param);
        } else void createItinerary(param);
      },
      cloneDeep,
      remove(data: Partial<Itinerary>) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this item?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteItinerary({ input: { id: data.id } });
        });
      },
      resetExpand() {
        if (expand.value && expand.value.find((e) => e)) {
          expand.value = Array.from(
            { length: expand.value.length },
            () => false
          );
        }
      },
      editItineraryDay(
        data: Partial<ItineraryDay>,
        index: number | 0,
        index2: number
      ) {
        const itineraryDay = {
          id: data.id,
          activities: data.activities?.map((e) => e?.id || e),
          noGuide: data.noGuide,
        };
        if (item.value.itineraries) {
          const itinerary = item.value.itineraries[index];
          if (itinerary && itinerary.itineraryDays) {
            itinerary.itineraryDays[index2] = itineraryDay as ItineraryDay;
            item.value.itineraries[index] = itinerary;
          }
        }

        void updateItineraryDay({
          input: itineraryDay,
        });
      },
    };
  },
});
</script>


<template >
  <q-form ref="form" class="q-mt-md" @submit="addItinerary">
    <div class="row q-col-gutter-md">
      <div class="col-3 col-sm-2 col-lg-1">
        <BaseInput v-model.number="itinerary.days" label="Days" validate></BaseInput>
      </div>
      <div class="col-9 col-sm-5 col-md-3">
        <BaseSelect
          v-model="itinerary.destination"
          :options="destinations"
          label="Destination"
          option-label="name"
          validate
        ></BaseSelect>
      </div>
      <div class="col-12 col-sm-5 col-md-3">
        <BaseSelect
          :disable="!houses.length"
          :loading="loadingHouse"
          v-model="itinerary.house"
          :options="houses"
          label="House"
          option-label="name"
        ></BaseSelect>
      </div>
      <div class="col-12 col-md-8 col-lg-7 text-right">
        <BaseButton :disable="loading" label="Add" type="submit" color="primary" class="q-ml-sm" />
      </div>
    </div>
  </q-form>

  <div v-if="itineraries.length" class="tw-mt-10">
    <div class="row q-col-gutter-md tw-mb-5">
      <div class="col-2 col-lg-1 tw-font-medium">Days</div>
      <div class="col-4 col-md-3 tw-font-medium">Destination</div>
      <div class="col-4 col-md-3 tw-font-medium">House</div>
    </div>
    <q-list bordered class="rounded-borders">
      <div v-for="(item, index) in itineraries" :key="item.id">
        <q-expansion-item group="same" v-model="expand[index]">
          <template #header>
            <div class="row tw-w-full">
              <div class="col-2 col-lg-1 tw-flex tw-items-center">{{item.days}}</div>
              <div class="col-4 col-md-3 tw-flex tw-items-center">{{item.destination?.name}}</div>
              <div class="col-4 col-md-3 tw-flex tw-items-center">{{item.house?.name}}</div>
              <div class="col-2 tw-whitespace-nowrap tw-flex tw-items-center">
                <!-- <q-icon
                  class="q-mr-sm"
                  name="edit"
                  color="teal"
                  style="font-size: 20px; cursor: pointer;"
                  @click.stop="itinerary = cloneDeep(item)"
                />-->
                <q-icon
                  name="delete"
                  color="negative"
                  style="font-size: 20px; cursor: pointer;"
                  @click.stop="remove(item)"
                />
              </div>
            </div>
          </template>
          <q-card>
            <q-card-section class="tw-bg-gray-100">
              <div class="row tw-w-full tw-mb-2">
                <div class="col-2 col-lg-1 tw-flex tw-items-center tw-justify-center">Tour Day #</div>
              </div>
              <div v-for="(item2, index2) in item.itineraryDays" :key="index2">
                <div class="row tw-w-full tw-mb-2" v-if="item2">
                  <div
                    class="col-2 col-lg-1 tw-flex tw-items-center tw-justify-center"
                  >{{item2.day}}</div>
                  <div class="col-4 col-md-3 tw-flex tw-items-center">
                    <BaseCheckBox
                      @update:model-value="editItineraryDay({...item2, noGuide: !item2.noGuide}, index, index2)"
                      label="No Guide"
                      v-model="item2.noGuide"
                    ></BaseCheckBox>
                  </div>
                  <div class="col-6 col-md-6">
                    <BaseSelect
                      v-model="item2.activities"
                      :options="activities.filter(e => e.destination.id == item.destination?.id)"
                      label="Activities"
                      placeholder="Activities"
                      option-label="name"
                      option-value="id"
                      emit-value
                      map-options
                      use-chips
                      multiple
                      @update:model-value="editItineraryDay(item2, index, index2)"
                    ></BaseSelect>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-separator />
      </div>
    </q-list>
  </div>
</template>
