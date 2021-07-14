<script lang="ts">
import useHouse from 'src/pages/house/houseService';
import { defineComponent, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import useHouseRoomType from '../houseRoomTypeService';
import { HouseRoom, HouseSeason } from 'src/graphql/@types/types.d';
import {
  createHouseRoomMutation,
  deleteHouseRoomMutation,
  updateHouseRoomMutation,
  createHouseSeasonRoomMutation,
} from 'src/graphql/query/house.graphql';
import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import request from 'src/api/request';

export default defineComponent({
  setup() {
    let { item: house, houseFormStep } = useHouse();

    const houseRooms = ref<Partial<HouseRoom>[]>([]);
    const houseRoomItem = ref<Partial<Record<string, unknown>>>({});

    houseRooms.value = (house.value.rooms as Partial<HouseRoom>[]) || [];

    let {
      list: houseRoomTypesList,
      items: houseRoomTypes,
    } = useHouseRoomType();

    if (!houseRoomTypes.value.length) houseRoomTypesList();

    const {
      mutate: createHouseRoom,
      loading: loadingCreate,
      onError,
    } = useMutation(createHouseRoomMutation, () => ({
      update: async (
        cache,
        {
          data: {
            createHouseRoom: { houseRoom },
          },
        }
      ) => {
        houseRoomItem.value = {};
        formRef.value.resetValidation();
        if (houseRooms.value) {
          houseRooms.value.push(houseRoom);
        }
        if (house.value.houseSeasons) {
          for (let houseSeason of house.value.houseSeasons as HouseSeason[]) {
            await request
              .mutate(createHouseSeasonRoomMutation, {
                input: {
                  price: (houseRoom as HouseRoom).price,
                  room: (houseRoom as HouseRoom).id,
                  houseSeason: houseSeason?.id,
                },
              })
              .then(
                ({
                  data: {
                    createHouseSeasonRoom: { houseSeasonRoom },
                  },
                }) => {
                  houseSeason.seasonRooms?.push(houseSeasonRoom);
                }
              );
          }
        }
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    const {
      mutate: deleteHouseRoom,
      loading: loadingDelete,
      onError: onErrorDelete,
    } = useMutation(deleteHouseRoomMutation, () => ({
      update: (
        cache,
        {
          data: {
            deleteHouseRoom: {
              houseRoom: { id },
            },
          },
        }
      ) => {
        if (houseRooms.value) {
          house.value.rooms = houseRooms.value = (houseRooms.value as HouseRoom[]).filter(
            (r: HouseRoom) => r.id != id
          );
        }
        if (house.value.houseSeasons) {
          for (let houseSeason of house.value.houseSeasons as HouseSeason[]) {
            houseSeason.seasonRooms = houseSeason?.seasonRooms?.filter(
              (r) => r && r.room.id != id
            );
          }
        }
      },
    }));

    onErrorDelete((e: Error) => {
      error(e);
    });

    const index = ref(-1);

    const {
      mutate: updateHouseRoom,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateHouseRoomMutation, () => ({
      update: (
        cache,
        {
          data: {
            updateHouseRoom: { houseRoom },
          },
        }
      ) => {
        if (houseRooms.value)
          houseRooms.value[index.value] = houseRoom as HouseRoom;
        houseRoomItem.value = {};
        formRef.value.resetValidation();
      },
    }));

    onErrorUpdate((e: Error) => {
      error(e);
    });

    const loading = computed(() => loadingCreate.value || loadingUpdate.value);

    const router = useRouter();

    const formRef = ref<Record<string, () => void>>({});

    return {
      houseRooms,
      houseRoomTypes,
      houseRoomItem,
      houseFormStep,
      loading,
      loadingDelete,
      formRef,
      cancel() {
        void router.push({ name: 'ListHouse' });
        house.value = {};
      },
      onSubmit() {
        if (houseRoomItem.value.id) {
          void updateHouseRoom({
            input: houseRoomItem.value,
          });
        } else
          void createHouseRoom({
            input: { house: house.value.id, ...houseRoomItem.value },
          });
      },
      remove(id: number) {
        void deleteHouseRoom({ input: { id: id } });
      },
      edit(houseRoom: HouseRoom) {
        index.value = houseRooms.value.indexOf(houseRoom);
        houseRoomItem.value = Object.assign(
          {},
          { ...houseRoom, roomType: houseRoom.roomType?.id || houseRoom.roomType }
        );
      },
    };
  },
});
</script>


<template >
  <q-form ref="formRef" @submit="onSubmit" class="q-mt-md">
    <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-3 tw-gap-4">
      <div class>
        <BaseSelect
          v-model="houseRoomItem.roomType"
          :options="houseRoomTypes"
          label="Room Type"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          validate
        ></BaseSelect>
      </div>
      <div class>
        <BaseInput v-model.number="houseRoomItem.price" label="Price" type="number" validate></BaseInput>
      </div>
      <div class="tw-flex tw-items-center tw-justify-end sm:tw-justify-start">
        <BaseButton
          :label="houseRoomItem.id ? 'Update' : 'Add'"
          :icon="houseRoomItem.id ? 'refresh' : 'add'"
          type="submit"
          color="primary"
          class="q-ml-sm"
          :loading="loading"
        />
      </div>
    </div>
  </q-form>
  <div class="row q-col-gutter-sm tw-mt-5">
    <div class="col-12 col-sm-8">
      <BaseTable
        v-if="houseRooms.length"
        :rows="houseRooms"
        :rows-per-page-options="[0]"
        hide-pagination
        :loading="loadingDelete"
        :columns="[{
    name: 'name',
    label: 'Name',
    align: 'left',
    field: row => row.roomType.name,
  },
  {
    name: 'price',
    label: 'Price',
    field: 'price',
    align: 'left',
  },
  { name: 'icon', label: '', field: '', align: 'right' }]"
      >
        <template v-slot:body-cell-icon="props">
          <q-td key="icon" :props="props">
            <q-icon
              class="q-mr-sm"
              name="edit"
              color="teal"
              style="font-size: 20px; cursor: pointer;"
              @click="edit(props.row)"
            />
            <q-icon
              name="delete"
              color="negative"
              style="font-size: 20px; cursor: pointer;"
              @click="remove(props.row.id)"
            />
          </q-td>
        </template>
      </BaseTable>
    </div>
  </div>
</template>
