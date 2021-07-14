<script lang="ts">
import { HouseRoomType } from 'src/graphql/@types/types';
import { defineComponent, computed, ref } from 'vue';
import useHouseRoomType from './houseRoomTypeService';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteHouseRoomTypeMutation,
  listHouseRoomTypeQuery,
  createHouseRoomTypeMutation,
  updateHouseRoomTypeMutation,
} from 'src/graphql/query/house.graphql';
import { error, success, beforeRemove } from 'src/helpers/notification';

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    let { list, items, item } = useHouseRoomType();

    let { loading: loadinglist } = list();

    const { mutate: deleteHouseRoomType, onError, onDone } = useMutation(
      deleteHouseRoomTypeMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteHouseRoomType: {
                houseHouseRoomType: { id },
              },
            },
          }
        ) => {
          let data: Record<string, []> | null = cache.readQuery({
            query: listHouseRoomTypeQuery,
          });
          if (data) {
            items.value = data.houseRoomType.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listHouseRoomTypeQuery,
              data: {
                houseRoomType: items.value,
              },
            });
          }
        },
      })
    );

    onError((e: Error) => {
      error(e);
    });

    onDone(() => {
      success({ message: 'The item have been deleted.' });
    });

    const {
      mutate: createHouseRoomType,
      loading: loadingCreate,
      onError: onErrorCreate,
      onDone: onDoneCreate,
    } = useMutation(createHouseRoomTypeMutation, () => ({
      update: (
        cache,
        {
          data: {
            createHouseRoomType: { houseHouseRoomType },
          },
        }
      ) => {
        const value: unknown = { ...houseHouseRoomType, ...item.value };

        const data: {
          houseRoomType: Partial<HouseRoomType>[];
        } | null = cache.readQuery({
          query: listHouseRoomTypeQuery,
        });
        cache.writeQuery({
          query: listHouseRoomTypeQuery,
          data: {
            houseRoomType: [...(data?.houseRoomType || []), value],
          },
        });
      },
    }));

    onErrorCreate((e: Error) => {
      error(e);
    });

    onDoneCreate(() => {
      item.value = {};
      formRef.value.resetValidation();
    });

    const {
      mutate: updateHouseRoomType,
      onError: onErrorUpdate,
      onDone: onDoneUpdate,
      loading: loadingUpdate,
    } = useMutation(updateHouseRoomTypeMutation, () => ({
      update: (cache) => {
        const data: Record<string, HouseRoomType[]> | null = cache.readQuery({
          query: listHouseRoomTypeQuery,
        });
        if (data) items.value = data.houseRoomType;
      },
    }));

    onErrorUpdate((e: Error) => {
      error(e);
    });

    onDoneUpdate(() => {
      item.value = {};
      formRef.value.resetValidation();
    });

    const formRef = ref<Record<string, () => void>>({});

    return {
      items,
      item,
      columns,
      deleteHouseRoomType,
      loading: computed(
        () => loadinglist.value || loadingCreate.value || loadingUpdate
      ),
      formRef,
      onSubmit() {
        if (typeof item.value.id == 'undefined')
          void createHouseRoomType({ input: item.value });
        else {
          const value = Object.assign({}, item.value) as HouseRoomType;
          delete value.__typename;
          void updateHouseRoomType({ input: value });
        }
      },
      edit(data: HouseRoomType) {
        item.value = Object.assign({}, data);
      },
      remove(data: HouseRoomType) {
        beforeRemove().onOk(() => {
          void deleteHouseRoomType({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="Room Types"
      :columns="columns"
      :rows="items"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-pagination
    >
      <template v-slot:top>
        <label class="text-h6">Room Types</label>
        <q-space />
        <q-form @submit="onSubmit" ref="formRef">
          <div
            class="tw-flex tw-justify-items-end tw-items-center tw-w-full tw-mt-5 sm:tw-mt-0 sm:tw-w-auto"
          >
            <BaseInput
              label="Name"
              v-model="item.name"
              clearable
              class="tw-w-full sm:tw-w-auto tw-mr-2"
              validate
            ></BaseInput>
            <div>
              <BaseButton :loading="loading" round color="primary" icon="add" type="submit" />
            </div>
          </div>
        </q-form>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="name" :props="props">{{ props.row.name }}</q-td>
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
              @click="remove(props.row)"
            />
          </q-td>
        </q-tr>
      </template>
    </BaseTable>
  </q-page>
</template>
