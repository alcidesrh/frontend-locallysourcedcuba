<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { Ref } from '@vue/reactivity/dist/reactivity';
import {
  Booking,
  BookingAccommodation,
  BookingHouse,
  BookingHouseRoom,
  House,
  HouseRoom,
  Tour,
} from 'src/graphql/@types/types';
import {
  bookingQuery,
  createBookingHouseMutation,
  deleteBookingHouseMutation,
  createBookingHouseRoomMutation,
  deleteBookingHouseRoomMutation,
  updateBookingHouseRoomMutation,
} from 'src/graphql/query/booking.graphql';
import useHouseRoomType from 'src/pages/house/houseRoomTypeService';
import { apolloClient } from 'src/boot/apollo';
import { cloneDeep } from 'lodash-es';

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
    const loading = ref(false);
    const newRoom = ref<Partial<HouseRoom>>({});
    const recentBookingHouse = ref<string>('');

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

    loading.value = true;
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
              rooms {
                id
                price
                cant
                roomType {
                  id
                  name
                }
              }
            }
          }
        `,
      })
      .then((resp: { data: { houses: Array<House> } }) => {
        houses.value = resp.data.houses;
        loading.value = false;
      });

    function updateCache() {
      const result = cloneDeep(
        apolloClient.cache.readQuery({
          query: bookingQuery,
          variables: {
            tourID: tour.value.id,
          },
        }) as Record<string, Booking[]>
      );

      const index = result.bookings.indexOf(
        result.bookings.find((e) => e.id == booking.id) as Booking
      );
      result.bookings[index] = booking;

      apolloClient.cache.writeQuery({
        query: bookingQuery,
        data: {
          bookings: result.bookings,
        },
        variables: { tourID: tour.value.id },
      });
    }

    return {
      itinerariesDays,
      itinerariesDaysHouse,
      bookingAccommodation,
      loading,
      houseDialog,
      houseRoomTypes,
      houses,
      newRoom,
      recentBookingHouse,
      async addBookingHouse(index: number) {
        loading.value = true;
        booking.bookingAccommodations;
        //Create booking house
        let bookingHouse: Partial<BookingHouse> = {};
        await apolloClient
          .mutate({
            mutation: createBookingHouseMutation,
            variables: {
              input: {
                house: (itinerariesDaysHouse.value[index] as House).id,
                bookingAccommodation: bookingAccommodation.value[index].id,
              },
            },
          })
          .then(
            ({
              data: {
                createBookingHouse: { bookingHouse: bookingHouseCreated },
              },
            }) => {
              bookingHouse = bookingHouseCreated as Partial<BookingHouse>;
              recentBookingHouse.value = bookingHouse.id as string;
            }
          );
        //Create booking house rooms
        if (booking.sleepingRequirement?.sRRoomTypes) {
          let houseRooms: Partial<HouseRoom[]> = [];
          booking.sleepingRequirement?.sRRoomTypes.filter((r) => {
            const rooms = (
              itinerariesDaysHouse.value[index] as House
            ).rooms?.filter((r2) => r2 && r2.roomType.id == r?.roomType?.id);
            if (rooms?.length)
              houseRooms = [
                ...houseRooms,
                ...[rooms[0]].map((r2) => {
                  return {
                    ...r2,
                    cant: r?.cant,
                  };
                }),
              ] as Array<HouseRoom>;
          });

          for (let i = 0; i < houseRooms.length; i++) {
            const r = houseRooms[i] as HouseRoom;
            await apolloClient
              .mutate({
                mutation: createBookingHouseRoomMutation,
                variables: {
                  input: {
                    bookingHouse: bookingHouse.id,
                    houseRoom: r.id,
                    price: r.price,
                    cant: booking.sleepingRequirement?.sRRoomTypes?.find(
                      (e) => r?.roomType.id == e?.roomType?.id
                    )?.cant,
                  },
                },
              })
              .then(
                ({
                  data: {
                    createBookingHouseRoom: { bookingHouseRoom },
                  },
                }) => {
                  if (!bookingHouse.bookingHouseRooms)
                    bookingHouse.bookingHouseRooms = [];
                  bookingHouse.bookingHouseRooms.push(bookingHouseRoom);
                }
              );
          }
        }
        bookingAccommodation.value[index].houses?.push(
          bookingHouse as BookingHouse
        );

        booking.bookingAccommodations =
          bookingAccommodation.value as BookingAccommodation[];

        updateCache();

        itinerariesDaysHouse.value[index] = null;

        loading.value = false;
      },
      async removeBookingHouse(h: BookingHouse, index: number, index2: number) {
        loading.value = true;
        await apolloClient
          .mutate({
            mutation: deleteBookingHouseMutation,
            variables: {
              input: { id: h.id },
            },
          })
          .then(() => {
            (bookingAccommodation.value[index].houses as []).splice(index2, 1);
            booking.bookingAccommodations =
              bookingAccommodation.value as BookingAccommodation[];
            updateCache();
          });
        loading.value = false;
      },
      async addBookingHouseRoom(
        r: Record<string, unknown>,
        index: number,
        index2: number
      ) {
        loading.value = true;
        await apolloClient
          .mutate({
            mutation: createBookingHouseRoomMutation,
            variables: {
              input: {
                bookingHouse: (
                  (bookingAccommodation.value[index].houses as [])[
                    index2
                  ] as BookingHouse
                ).id,
                houseRoom: (r.houseRoom as Record<string, unknown>)?.id,
                price: r?.price ?? null,
                cant: r?.cant ?? null,
              },
            },
          })
          .then(
            ({
              data: {
                createBookingHouseRoom: { bookingHouseRoom },
              },
            }) => {
              (
                (
                  (bookingAccommodation.value[index].houses as [])[
                    index2
                  ] as BookingHouse
                ).bookingHouseRooms as Array<BookingHouseRoom>
              ).push(bookingHouseRoom as BookingHouseRoom);
              booking.bookingAccommodations =
                bookingAccommodation.value as BookingAccommodation[];
              updateCache();
              newRoom.value = {};
            }
          );
        loading.value = false;
      },
      async updateBookingHouseRoom(
        r: BookingHouseRoom,
        index: number,
        index2: number,
        index3: number
      ) {
        loading.value = true;
        await apolloClient
          .mutate({
            mutation: updateBookingHouseRoomMutation,
            variables: {
              input: {
                id: r.id,
                price: r.price,
                cant: r.cant,
              },
            },
          })
          .then(
            ({
              data: {
                updateBookingHouseRoom: { bookingHouseRoom },
              },
            }) => {
              (
                (
                  (bookingAccommodation.value[index].houses as [])[
                    index2
                  ] as BookingHouse
                ).bookingHouseRooms as Array<BookingHouseRoom>
              )[index3] = bookingHouseRoom as BookingHouseRoom;
              booking.bookingAccommodations =
                bookingAccommodation.value as BookingAccommodation[];
              updateCache();
            }
          );
        loading.value = false;
      },
      async removeBookingHouseRoom(
        rooms: BookingHouseRoom[],
        index: number,
        index2: number,
        index3: number
      ) {
        loading.value = true;
        await apolloClient
          .mutate({
            mutation: deleteBookingHouseRoomMutation,
            variables: {
              input: { id: rooms[index3].id },
            },
          })
          .then(() => {
            (
              (
                (bookingAccommodation.value[index].houses as [])[
                  index2
                ] as BookingHouse
              ).bookingHouseRooms as []
            ).splice(index3, 1);
            booking.bookingAccommodations =
              bookingAccommodation.value as BookingAccommodation[];
            updateCache();
          });
        loading.value = false;
      },
    };
  },
});
</script>

<template >
  <q-dialog v-model="houseDialog">
    <q-card style="width: 100%; max-width: 900px">
      <BaseLoading :showing="loading" />
      <q-card-section class="row items-center tw-py-3 bg-primary tw-mb-7">
        <div class="tw-relative tw-w-full">
          <div
            class="text-h6 tw-text-white tw-pr-5"
          >Booking: {{booking.name}}. Pax number: {{booking.pax}}</div>
          <q-btn
            class="tw-absolute tw-top-0 tw-right-0 tw--mr-3 tw--mt-2"
            icon="close"
            flat
            round
            dense
            v-close-popup
            color="white"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form class="q-mt-md" :class="{'tw-opacity-50': loading}">
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
                @click="addBookingHouse(index)"
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
                    :default-opened="e && e.id == recentBookingHouse"
                  >
                    <template v-slot:header>
                      <q-item-section>{{e?.house?.name}}</q-item-section>

                      <q-item-section side>
                        <q-icon
                          @click.stop="removeBookingHouse(e, index, index2)"
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
                              :options="houses ? houses.find(h => h.id == e.house.id).rooms.map(r => {return {id: r.id, name: r.roomType.name}}).filter((item, index, self) => {return self.indexOf(self.find(item2 => item2.name == item.name)) == index;}) : []"
                              label="Room type"
                              option-label="name"
                              v-model="newRoom.houseRoom"
                            ></BaseSelect>
                          </div>
                          <div class="tw-mx-2" style="max-width: 60px;">
                            <BaseInput v-model.number="newRoom.cant" label="#" type="number"></BaseInput>
                          </div>
                          <div style="max-width: 90px;">
                            <BaseInput v-model.number="newRoom.price" label="Price" type="number"></BaseInput>
                          </div>
                          <div>
                            <q-btn
                              round
                              color="primary"
                              icon="add"
                              class="tw-mx-2"
                              size="sm"
                              @click="addBookingHouseRoom(newRoom, index, index2)"
                            />
                          </div>
                        </div>

                        <div
                          class="tw-flex tw-items-center tw-mt-2"
                          v-for="(r, indexR) in e.bookingHouseRooms"
                          :key="indexR"
                        >
                          <div style="width: 300px">
                            <BaseInput
                              v-model="r.houseRoom.roomType.name"
                              label="Room type"
                              type="text"
                              readonly
                            ></BaseInput>
                          </div>
                          <div class="tw-mx-2" style="max-width: 60px;">
                            <BaseInput v-model.number="r.cant" label="#" type="number"></BaseInput>
                          </div>
                          <div style="max-width: 90px;">
                            <BaseInput v-model.number="r.price" label="Price" type="number"></BaseInput>
                          </div>
                          <div class="tw-flex">
                            <q-icon
                              class="tw-ml-1"
                              name="save"
                              color="teal"
                              style="font-size: 19px; cursor: pointer"
                              @click="updateBookingHouseRoom(r, index, index2, indexR)"
                            />
                            <q-icon
                              class="tw-ml-1"
                              name="delete"
                              color="negative"
                              style="font-size: 19px; cursor: pointer"
                              @click="removeBookingHouseRoom(e.bookingHouseRooms, index, index2, indexR)"
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
    </q-card>
  </q-dialog>
</template>
