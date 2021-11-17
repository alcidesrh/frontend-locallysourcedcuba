<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue';
import { Ref } from '@vue/reactivity/dist/reactivity';
import {
  Booking,
  HouseRoomType,
  SleepingRequirement,
  SrRoomType,
  Tour,
} from 'src/graphql/@types/types';
import { useMutation } from '@vue/apollo-composable';
import {
  createSleepingRequirementMutation,
  updateSleepingRequirementMutation,
  deleteSleepingRequirementRoomTypeMutation,
  createSleepingRequirementRoomTypeMutation,
} from 'src/graphql/query/sleepingRequirement.graphql';
import { updateBookingMutation } from 'src/graphql/query/booking.graphql';
import { error } from 'src/helpers/notification';
import useHouseRoomType from 'src/pages/house/houseRoomTypeService';
import useHouseType from 'src/pages/house/houseTypeService';
import { apolloClient } from 'src/boot/apollo';
import { omit } from 'lodash-es';

export default defineComponent({
  props: {
    booking: Object,
  },
  setup(props: Record<string, Partial<Booking>>) {
    const tour = inject('item') as Ref<Tour>;
    const booking = tour.value.bookings?.find((e) => e?.id == props.booking.id);
    if (!booking) return;

    const sleepingDialog = ref(true);
    const name = booking.name as string;

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

    if (booking.sleepingRequirement?.sRRoomTypes) {
      rooms.value = booking.sleepingRequirement
        ?.sRRoomTypes as Partial<SrRoomType>[];
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

        const bookingIndex = tour.value.bookings?.indexOf(booking) as number;
        sr.value = {
          booking: sr.value.booking,
          ...(sleepingRequirement as SleepingRequirement),
        };
        if (tour.value.bookings)
          (tour.value.bookings[bookingIndex] as Booking).sleepingRequirement =
            sr.value as SleepingRequirement;

        for (let index = 0, data = {}; index < rooms.value.length; index++) {
          data = {
            sleepingRequirement: sr.value.id,
            rooms: rooms.value[index].rooms,
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
                if (tour.value.bookings) {
                  (
                    tour.value.bookings[bookingIndex] as Booking
                  ).sleepingRequirement?.sRRoomTypes?.push(
                    sRRoomType as SrRoomType
                  );
                }
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
          booking: sr.value.booking,
          ...(sleepingRequirement as SleepingRequirement),
        };
      },
    }));
    onErrorUpdate((e: Error) => {
      error(e);
    });

    watch(
      [loadingCreate, loadingUpdate],
      ([v, v2]) => (loading.value = v || v2)
    );

    return {
      loading,
      sleepingDialog,
      sr,
      houseTypes,
      houseRoomTypes,
      room,
      roomCant,
      name,
      rooms,
      addRoom() {
        if (room.value)
          rooms.value.push({
            roomType: room.value as unknown as HouseRoomType,
            rooms: roomCant.value,
          });
        room.value = roomCant.value = null;
      },
      removeRoom(index: number) {
        if (rooms.value[index].id)
          void apolloClient.mutate({
            mutation: deleteSleepingRequirementRoomTypeMutation,
            variables: {
              input: {
                id: rooms.value[index].id,
              },
            },
          });

        rooms.value.splice(index, 1);
      },
      async save() {
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
            if (!rooms.value[index].id)
              await apolloClient.mutate({
                mutation: createSleepingRequirementRoomTypeMutation,
                variables: {
                  input: {
                    sleepingRequirement: sr.value.id,
                    rooms: rooms.value[index].rooms,
                    roomType: rooms.value[index].roomType?.id,
                  },
                },
              });
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
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Sleeping Requirement for {{name}}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
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
                          <span style="min-width: 20px;" class="tw-mx-5">{{room.rooms}}</span>
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
