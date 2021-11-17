<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue';
import { Ref } from '@vue/reactivity/dist/reactivity';
import {
  Booking,
  BookingAccommodation,
  BookingHouse,
  House,
  HouseRoom,
  HouseRoomType,
  SleepingRequirement,
  SrRoomType,
  Tour,
} from 'src/graphql/@types/types';
import { useMutation } from '@vue/apollo-composable';
import { housesQuery } from 'src/graphql/query/house.graphql';
import { updateBookingMutation } from 'src/graphql/query/booking.graphql';
import { error } from 'src/helpers/notification';
import useHouseRoomType from 'src/pages/house/houseRoomTypeService';
import useHouse from 'src/pages/house/houseService';
import { apolloClient } from 'src/boot/apollo';
import { omit } from 'lodash-es';
// import itinerariesDays from 'src/store/generic';
import gql from 'graphql-tag';

export default defineComponent({
  props: {
    booking: Object,
    itinerariesDaysProp: Array,
  },
  setup(props: Record<string, unknown>) {
    const tour = inject('item') as Ref<Tour>;

    const booking = props.booking as Booking;

    const houseDialog = ref(true);
    const name = booking.name as string;

    const itinerariesDays = props.itinerariesDaysProp as Array<
      Record<string, Record<string, unknown>>
    >;

    const itinerariesDaysHouse = ref<Array<Partial<House> | null>>(
      Array.from({ length: itinerariesDays.length }, () => null)
    );

    const bookingAccommodation = ref<Array<Partial<BookingAccommodation>>>([]);
    if (booking.bookingAccommodations)
      bookingAccommodation.value = booking.bookingAccommodations as Array<
        Partial<BookingAccommodation>
      >;

    const { list: houseRoomTypesList, items: houseRoomTypes } =
      useHouseRoomType();
    if (!houseRoomTypes.value.length) houseRoomTypesList();

    const houses = ref<Array<House>>();
    void apolloClient
      .query({
        query: gql`
          query getHouses {
            houses {
              id
              name
              destination {
                id
              }
            }
          }
        `,
      })
      .then(
        (resp: { data: { houses: Array<House> } }) =>
          (houses.value = resp.data.houses)
      );

    // const {
    //   mutate: createSleepingRequirement,
    //   loading: loadingCreate,
    //   onError: onErrorCreate,
    // } = useMutation(createSleepingRequirementMutation, () => ({
    //   update: async (
    //     cache,
    //     {
    //       data: {
    //         createSleepingRequirement: { sleepingRequirement },
    //       },
    //     }
    //   ) => {
    // loading.value = true;
    // const bookingIndex = tour.value.bookings?.indexOf(booking) as number;
    // void apolloClient.mutate({
    //   mutation: updateBookingMutation,
    //   variables: {
    //     input: {
    //       id: sr.value.booking,
    //       sleepingRequirement: sr.value.id,
    //     },
    //   },
    // });
    // for (let index = 0, data = {}; index < rooms.value.length; index++) {
    //   data = {
    //     sleepingRequirement: sr.value.id,
    //     rooms: rooms.value[index].rooms,
    //     roomType: rooms.value[index].roomType?.id,
    //   };
    //   await apolloClient
    //     .mutate({
    //       mutation: createSleepingRequirementRoomTypeMutation,
    //       variables: {
    //         input: data,
    //       },
    //     })
    //     .then(
    //       ({
    //         data: {
    //           createSRRoomType: { sRRoomType },
    //         },
    //       }) => {
    //         if (tour.value.bookings)
    //           (
    //             tour.value.bookings[bookingIndex] as Booking
    //           ).sleepingRequirement?.sRRoomTypes?.push(
    //             sRRoomType as SrRoomType
    //           );
    //       }
    //     );
    // }
    // loading.value = false;
    //   },
    // }));
    // onErrorCreate((e: Error) => {
    //   error(e);
    // });

    // const {
    //   mutate: updateSleepingRequirement,
    //   loading: loadingUpdate,
    //   onError: onErrorUpdate,
    // } = useMutation(updateSleepingRequirementMutation, () => ({
    //   update: (
    //     cache,
    //     {
    //       data: {
    //         updateSleepingRequirement: { sleepingRequirement },
    //       },
    //     }
    //   ) => {
    //     sr.value = {
    //       booking: sr.value.booking,
    //       ...(sleepingRequirement as SleepingRequirement),
    //     };
    //   },
    // }));
    // onErrorUpdate((e: Error) => {
    //   error(e);
    // });

    // watch(
    //   [loadingCreate, loadingUpdate],
    //   ([v, v2]) => (loading.value = v || v2)
    // );
    return {
      itinerariesDays,
      itinerariesDaysHouse,
      bookingAccommodation,
      // loading,
      houseDialog,
      houseRoomTypes,
      houses,
      name,
      async save() {
        // const data = omit(
        //   {
        //     ...sr.value,
        //     accommodationType: sr.value.accommodationType?.id,
        //   },
        //   ['booking', 'sRRoomTypes']
        // );
        // if (!sr.value.id) {
        //   void createSleepingRequirement({ input: data });
        // } else {
        //   loading.value = true;
        //   for (let index = 0; index < rooms.value.length; index++) {
        //     if (!rooms.value[index].id)
        //       await apolloClient.mutate({
        //         mutation: createSleepingRequirementRoomTypeMutation,
        //         variables: {
        //           input: {
        //             sleepingRequirement: sr.value.id,
        //             rooms: rooms.value[index].rooms,
        //             roomType: rooms.value[index].roomType?.id,
        //           },
        //         },
        //       });
        //   }
        //   loading.value = false;
        //   void updateSleepingRequirement({ input: data });
        // }
      },
      addHouse(index: number) {
        if (!bookingAccommodation.value[index]) {
          bookingAccommodation.value[index] = {
            houses: [],
            booking: booking.id as unknown as Booking,
          };
        }
        if (booking.sleepingRequirement?.sRRoomTypes)
          bookingAccommodation.value[index].houses?.push({
            house: itinerariesDaysHouse.value[index] as House,
            rooms: [] as Array<HouseRoom>,
          } as BookingHouse);

        itinerariesDaysHouse.value[index] = null;
      },
      removeHouse(index: number, index2: number) {
        (bookingAccommodation.value[index].houses as []).splice(index2, 1);
      },
    };
  },
});
</script>

<template >
  <q-dialog v-model="houseDialog">
    <q-card style="width: 100%; max-width: 900px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Accomodation for {{name}}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form class="q-mt-md">
          <div
            class="row q-col-gutter-sm tw-mb-3"
            v-for="(e, index) in itinerariesDays"
            :key="index"
          >
            <div class="col-4 tw-flex tw-items-center">
              <q-icon
                name="done"
                :color="e && e.houses ? 'teal' : 'gray'"
                style="font-size: 20px; cursor: pointer;"
                class="tw-mr-2"
              />
              {{e.days}}
            </div>
            <div class="col-2 tw-flex tw-items-center">{{e.destination.name}}</div>
            <div class="col-6 tw-flex tw-items-center">
              <BaseSelect
                class="tw-w-full"
                :options="houses ? houses.filter(h => h.destination && h.destination.id == e.destination.id && (!bookingAccommodation[index] || !bookingAccommodation[index].houses?.filter(e => e && e.house && e.house.id == h.id).length)) : []"
                :label="'Accommodations in ' + e.destination.name"
                option-label="name"
                v-model="itinerariesDaysHouse[index]"
              ></BaseSelect>
              <q-btn
                round
                color="primary"
                icon="add"
                class="tw-ml-2"
                size="sm"
                @click="addHouse(index)"
              />
            </div>

            <div class="col-12" v-if="bookingAccommodation && bookingAccommodation[index]">
              <div
                class="row tw-mb-2"
                v-for="(e, index2) in bookingAccommodation[index].houses"
                :key="index2"
              >
                <div class="col-6 offset-6">
                  <q-expansion-item
                    expand-icon-toggle
                    class="shadow-1 overflow-hidden"
                    expand-separator
                    switch-toggle-side
                    header-class="bg-teal text-white"
                    expand-icon-class="text-white"
                    group="somegroup"
                    :default-opened="e && !e.id"
                  >
                    <template v-slot:header>
                      <q-item-section>{{e?.house?.name}}</q-item-section>

                      <q-item-section side>
                        <q-icon
                          @click.stop="removeHouse(index, index2)"
                          name="delete"
                          color="negative"
                          style="font-size: 20px; cursor: pointer"
                        />
                      </q-item-section>
                    </template>

                    <q-card>
                      <q-card-section>
                        <div class="tw-flex tw-items-center">
                          <div style="width: 300px">
                            <BaseSelect
                              :options="houseRoomTypes"
                              label="Room type"
                              option-label="name"
                            ></BaseSelect>
                          </div>
                          <div class="tw-mx-2" style="max-width: 60px;">
                            <BaseInput v-model.number="newBooking" label="#" type="number"></BaseInput>
                          </div>
                          <div style="max-width: 90px;">
                            <BaseInput v-model.number="newBooking" label="Price" type="number"></BaseInput>
                          </div>
                          <div>
                            <q-btn
                              round
                              color="primary"
                              icon="add"
                              class="tw-ml-2"
                              size="sm"
                              @click="addHouse(index)"
                            />
                          </div>
                        </div>
                      </q-card-section>
                    </q-card>
                  </q-expansion-item>
                </div>
              </div>
            </div>

            <div class="col-12" v-if="index < itinerariesDays.length - 1">
              <q-separator class="tw-my-3" />
            </div>
          </div>

          <div class="flex justify-end q-mt-lg"></div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <BaseButton
          @click="save"
          label="Cancel"
          type="button"
          color="primary"
          class="q-ml-sm"
          v-close-popup
        />
        <BaseButton @click="save" label="Save" type="button" color="primary" class="q-ml-sm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
