<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import {
  Booking,
  HouseRoomType,
  SleepingRequirement,
  SrRoomType,
} from 'src/graphql/@types/types';
import { useMutation, useApolloClient } from '@vue/apollo-composable';
import {
  createSleepingRequirementMutation,
  updateSleepingRequirementMutation,
  deleteSleepingRequirementRoomTypeMutation,
  createSleepingRequirementRoomTypeMutation,
} from 'src/graphql/query/sleepingRequirement.graphql';
import {
  updateBookingMutation,
  bookingQuery,
} from 'src/graphql/query/booking.graphql';
import { error } from 'src/helpers/notification';
import useHouseRoomType from 'src/pages/house/houseRoomTypeService';
import useHouseType from 'src/pages/house/houseTypeService';
import { apolloClient } from 'src/boot/apollo';
import { omit, cloneDeep } from 'lodash-es';
import useLsTour from 'src/pages/tour/ls/lsTourService';

export default defineComponent({
  props: {
    booking: Object,
  },
  setup(props: Record<string, Partial<Booking>>) {
    const { item: tour } = useLsTour();

    const booking = cloneDeep(props.booking);

    const sleepingDialog = ref(true);

    const { list: houseRoomTypesList, items: houseRoomTypes } =
      useHouseRoomType();
    if (!houseRoomTypes.value.length) houseRoomTypesList();

    const { list: houseTypesList, items: houseTypes } = useHouseType();
    if (!houseTypes.value.length) houseTypesList();

    const sr = ref<Partial<SleepingRequirement>>(
      booking.sleepingRequirement
        ? omit(booking.sleepingRequirement, ['sRRoomTypes'])
        : {
            booking: booking.id as unknown as Booking,
          }
    );
    const room = ref<Partial<HouseRoomType> | null>(null);
    const roomCant = ref<number | null>(null);
    const rooms = ref<Partial<SrRoomType>[]>([]);
    const loading = ref(false);
    const { client } = useApolloClient();

    if (booking.sleepingRequirement?.sRRoomTypes) {
      rooms.value = booking.sleepingRequirement?.sRRoomTypes
        ? cloneDeep(
            booking.sleepingRequirement?.sRRoomTypes as Partial<SrRoomType>[]
          )
        : [];
    }

    function updateCache() {
      const result = cloneDeep(
        client.cache.readQuery({
          query: bookingQuery,
          variables: {
            tourID: tour.value.id,
          },
        }) as Record<string, Booking[]>
      );

      const index = result.bookings.indexOf(
        result.bookings.find((e) => e.id == booking.id) as Booking
      );
      result.bookings[index] = booking as Booking;

      client.cache.writeQuery({
        query: bookingQuery,
        data: {
          bookings: result.bookings,
        },
        variables: { tourID: tour.value.id },
      });
    }

    const {
      mutate: createSleepingRequirement,
      loading: loadingCreate,
      onError: onErrorCreate,
    } = useMutation(createSleepingRequirementMutation, () => ({
      update: async (
        cache,
        {
          data: {
            createSleepingRequirement: { sleepingRequirement },
          },
        }
      ) => {
        loading.value = true;
        sr.value = {
          booking: sr.value.booking,
          ...(sleepingRequirement as SleepingRequirement),
        };

        booking.sleepingRequirement = cloneDeep(
          sr.value
        ) as SleepingRequirement;

        for (let index = 0, data = {}; index < rooms.value.length; index++) {
          data = {
            sleepingRequirement: sr.value.id,
            cant: rooms.value[index].cant,
            roomType: rooms.value[index].roomType?.id,
          };
          await apolloClient
            .mutate({
              mutation: createSleepingRequirementRoomTypeMutation,
              variables: {
                input: data,
              },
            })
            .then(
              ({
                data: {
                  createSRRoomType: { sRRoomType },
                },
              }) => {
                booking.sleepingRequirement?.sRRoomTypes?.push(
                  sRRoomType as SrRoomType
                );
                sr.value = booking.sleepingRequirement as SleepingRequirement;
                rooms.value = sr.value.sRRoomTypes as SrRoomType[];
              }
            );
        }
        void apolloClient.mutate({
          mutation: updateBookingMutation,
          variables: {
            input: {
              id: sr.value.booking,
              sleepingRequirement: sr.value.id,
            },
          },
        });
        updateCache();
        loading.value = false;
      },
    }));
    onErrorCreate((e: Error) => {
      error(e);
    });

    const {
      mutate: updateSleepingRequirement,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateSleepingRequirementMutation, () => ({
      update: (
        cache,
        {
          data: {
            updateSleepingRequirement: { sleepingRequirement },
          },
        }
      ) => {
        sr.value = {
          ...sr.value,
          accommodationType: (sleepingRequirement as SleepingRequirement)
            .accommodationType,
        };
        booking.sleepingRequirement = cloneDeep(
          sr.value
        ) as SleepingRequirement;

        updateCache();
      },
    }));
    onErrorUpdate((e: Error) => {
      error(e);
      console.log(e);
    });

    watch(
      [loadingCreate, loadingUpdate],
      ([v, v2]) => (loading.value = v || v2)
    );

    async function createRoom(room: Partial<SrRoomType>) {
      await apolloClient
        .mutate({
          mutation: createSleepingRequirementRoomTypeMutation,
          variables: {
            input: {
              sleepingRequirement: sr.value.id,
              cant: room.cant,
              roomType: room.roomType?.id,
            },
          },
        })
        .then(
          ({
            data: {
              createSRRoomType: { sRRoomType },
            },
          }) => {
            booking.sleepingRequirement?.sRRoomTypes?.push(
              sRRoomType as SrRoomType
            );
            sr.value = booking.sleepingRequirement as SleepingRequirement;
            rooms.value = sr.value.sRRoomTypes as SrRoomType[];
          }
        );
    }

    return {
      loading,
      sleepingDialog,
      sr,
      houseTypes,
      houseRoomTypes,
      room,
      roomCant,
      rooms,
      addRoom() {
        if (room.value)
          rooms.value.push({
            roomType: room.value as unknown as HouseRoomType,
            cant: roomCant.value,
          });
        room.value = roomCant.value = null;
      },
      removeRoom(index: number) {
        if (rooms.value[index].id) {
          void apolloClient.mutate({
            mutation: deleteSleepingRequirementRoomTypeMutation,
            variables: {
              input: {
                id: rooms.value[index].id,
              },
            },
          });
          booking.sleepingRequirement?.sRRoomTypes?.splice(index, 1);
          updateCache();
        }

        rooms.value.splice(index, 1);
      },
      save() {
        if (loadingCreate.value || loadingUpdate.value) return;
        const data = omit(
          {
            ...sr.value,
            accommodationType: sr.value.accommodationType?.id,
          },
          ['booking', 'sRRoomTypes']
        );

        if (!sr.value.id) {
          void createSleepingRequirement({ input: data });
        } else {
          loading.value = true;
          for (let index = 0; index < rooms.value.length; index++) {
            if (!rooms.value[index].id) void createRoom(rooms.value[index]);
          }
          loading.value = false;
          void updateSleepingRequirement({ input: data });
        }
      },
    };
  },
});
</script>

<template >
  <q-dialog v-model="sleepingDialog">
    <q-card>
      <q-card-section class="row items-center tw-py-3 bg-primary tw-mb-7">
        <div class="tw-relative tw-w-full">
          <div
            class="text-h6 tw-text-white tw-pr-5"
          >Booking: {{booking.name}}. Pax number: {{booking.pax}}</div>
          <q-space />
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
        <q-form class="q-mt-md">
          <div class="row q-col-gutter-sm">
            <div class="col-12 col-sm-4">
              <BaseSelect
                v-model="sr.accommodationType"
                :options="houseTypes"
                label="Type*"
                option-label="name"
                validate
              ></BaseSelect>
            </div>
            <div class="col-12 col-sm-8">
              <BaseInput v-model="sr.description" label="Information"></BaseInput>
            </div>
            <div class="col-12 col-sm-4">
              <BaseSelect v-model="room" :options="houseRoomTypes" label="Room" option-label="name"></BaseSelect>
            </div>
            <div class="col-12 col-sm-4">
              <BaseInput v-model.number="roomCant" type="number" label="Cant"></BaseInput>
            </div>
            <div class="col-12 col-sm-4 tw-flex tw-items-center tw-justify-end sm:tw-justify-start">
              <BaseButton
                @click="addRoom"
                label="Add"
                type="button"
                color="primary"
                class="q-ml-sm"
              />
            </div>
            <div class="col-12" v-if="rooms.length">
              <div class="row">
                <div class="col-12 col-sm-8">
                  <q-list bordered separator>
                    <q-item v-ripple v-for="(room, index) in rooms" :key="index">
                      <q-item-section>
                        <div class="tw-flex tw-justify-between">
                          <div style="min-width: 60px;">{{room.roomType?.name}}</div>
                          <span style="min-width: 20px;" class="tw-mx-5">{{room.cant}}</span>
                          <div>
                            <q-icon
                              @click="removeRoom(index)"
                              name="delete"
                              color="negative"
                              style="font-size: 20px; cursor: pointer;"
                            />
                          </div>
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
              <div style="max-width: 200px;"></div>
            </div>
          </div>

          <div class="flex justify-end q-mt-lg"></div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <BaseButton
          @click="save"
          :loading="loading"
          label="Save"
          type="button"
          color="primary"
          class="q-ml-sm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
