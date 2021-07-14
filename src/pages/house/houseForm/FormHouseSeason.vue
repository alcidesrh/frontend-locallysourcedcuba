<script lang="ts">
import useHouse from 'src/pages/house/houseService';
import { defineComponent, ref, computed, watch } from 'vue';
import useHouseRoomType from '../houseRoomTypeService';
import request from 'src/api/request';
import {
  HouseSeason,
  HouseSeasonRoom,
  HouseRoom,
} from 'src/graphql/@types/types.d';
import {
  createHouseSeasonMutation,
  createHouseSeasonRoomMutation,
  deleteHouseSeasonMutation,
  updateHouseSeasonRoomMutation,
} from 'src/graphql/query/house.graphql';
import { useMutation } from '@vue/apollo-composable';
import { format } from 'src/helpers/date';

export default defineComponent({
  setup() {
    let { item: house, houseFormStep } = useHouse();

    const houseSeasons = ref<Partial<HouseSeason>[]>([]);
    houseSeasons.value =
      (house.value.houseSeasons as Partial<HouseSeason>[]) || [];

    const houseSeasonItem = ref<Partial<HouseSeason>>({});

    const loadingCreateSeasonRoom = ref(false);

    let {
      list: houseRoomTypesList,
      items: houseRoomTypes,
    } = useHouseRoomType();

    if (!houseRoomTypes.value.length) houseRoomTypesList();

    const { mutate: createHouseSeason, loading: loadingCreate } = useMutation(
      createHouseSeasonMutation,
      () => ({
        update: async (
          cache,
          {
            data: {
              createHouseSeason: {
                houseSeason: { id },
              },
            },
          }
        ) => {
          const houseSeasonData = ref(houseSeasonItem.value);

          houseSeasonData.value.seasonRooms = [];
          houseSeasonData.value.id = id as string;

          houseSeasons.value.push(houseSeasonData.value);

          loadingCreateSeasonRoom.value = true;

          for (let e of house.value.rooms as HouseRoom[]) {
            await request
              .mutate(createHouseSeasonRoomMutation, {
                input: {
                  price: e?.price,
                  room: e?.id,
                  houseSeason: id as string,
                },
              })
              .then(
                ({
                  data: {
                    createHouseSeasonRoom: { houseSeasonRoom },
                  },
                }) => {
                  houseSeasonData.value.seasonRooms?.push(houseSeasonRoom);
                }
              );
          }

          houseSeasonItem.value = {};
          formRef.value.resetValidation();
          loadingCreateSeasonRoom.value = false;
        },
      })
    );

    const { mutate: deleteHouseSeason } = useMutation(
      deleteHouseSeasonMutation
    );

    const formRef = ref<Record<string, () => void>>({});

    const updateSeasonRoomLoading = ref<boolean[]>([]);

    const startDate = computed(
      () =>
        houseSeasonItem.value.startDate &&
        format(houseSeasonItem.value.startDate)
    );
    const endDate = computed(
      () =>
        houseSeasonItem.value.endDate && format(houseSeasonItem.value.endDate)
    );

    const startDatePopup = ref(false);
    const endDatePopup = ref(false);

    watch([startDate, endDate], () => {
      startDatePopup.value = endDatePopup.value = false;
    });

    return {
      houseSeasons,
      houseSeasonItem,
      houseFormStep,
      updateSeasonRoomLoading,
      startDatePopup,
      endDatePopup,
      formRef,
      format,
      startDate,
      endDate,
      loading: computed(
        () => loadingCreate.value || loadingCreateSeasonRoom.value
      ),
      onSubmit() {
        void createHouseSeason({
          input: { ...houseSeasonItem.value, house: house.value.id },
        });
      },
      remove(index: number) {
        void deleteHouseSeason({
          input: { id: houseSeasons.value[index].id },
        }).then(() => {
          houseSeasons.value.splice(index, 1);
        });
      },
      async updateSeasonRoom(houseSeason: Partial<HouseSeason>, index: number) {
        updateSeasonRoomLoading.value[index] = true;
        for (let e of houseSeason.seasonRooms as HouseSeasonRoom[]) {
          if (typeof e.price === 'string') e.price = parseInt(e.price);
          await request.mutate(updateHouseSeasonRoomMutation, {
            input: {
              id: e.id,
              price: e.price,
            },
          });
        }
        updateSeasonRoomLoading.value[index] = false;
      },
    };
  },
});
</script>


<template >
  <q-form ref="formRef" @submit="onSubmit" class="q-mt-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-4">
        <BaseInput readonly v-model="startDate" :validate="!startDate" label="Start">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                v-model="startDatePopup"
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date minimal v-model="houseSeasonItem.startDate" default-view="Months"></q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </BaseInput>
      </div>
      <div class="col-12 col-sm-4">
        <BaseInput readonly v-model="endDate" validate label="End">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy v-model="endDatePopup" transition-show="scale" transition-hide="scale">
                <q-date
                  minimal
                  v-model="houseSeasonItem.endDate"
                  default-view="Months"
                  :options="(date) => houseSeasonItem.startDate && date > houseSeasonItem.startDate"
                ></q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </BaseInput>
      </div>
      <div class="col-12 col-sm-4 tw-flex tw-items-center tw-justify-end sm:tw-justify-start">
        <BaseButton
          label="Add"
          icon="add"
          type="submit"
          color="primary"
          class="q-ml-sm"
          :loading="loading"
        />
      </div>
    </div>
  </q-form>
  <div class="row q-col-gutter-sm tw-mt-5">
    <div
      class="col-12 col-sm-6 col-md-4 col-lg-3 tw-mt-3"
      v-for="(item, index) in houseSeasons"
      :key="index"
    >
      <q-card flat bordered>
        <q-card-section class="tw-pt-1 tw-pr-1">
          <div class="tw-text-right">
            <BaseIcon
              name="delete"
              color="negative"
              class="tw-cursor-pointer"
              @click="remove(index)"
            />
          </div>
          <div class="tw-text-md tw-font-medium">
            Season:
            <span
              class="tw-whitespace-nowrap tw-text-gray-500"
            >{{format(item.startDate)}} to {{format(item.endDate)}}</span>
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section class="q-pt-none tw-mt-5">
          <div class="tw-text-md tw-font-medium tw-mt-5 tw-mb-3 tw-text-gray-500">Rooms prices</div>

          <div v-for="(seasonRoom, index) in item.seasonRooms" :key="index" class="tw-mb-5">
            <BaseInput
              v-if="seasonRoom"
              v-model="seasonRoom.price"
              :label="seasonRoom?.room.roomType.name"
              type="number"
            ></BaseInput>
          </div>
          <div class="tw-text-right">
            <BaseButton
              label="Update"
              color="primary"
              size="sm"
              @click="updateSeasonRoom(item, index)"
              :loading="updateSeasonRoomLoading[index]"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
