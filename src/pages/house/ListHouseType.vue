<script lang="ts">
import { HouseType } from 'src/graphql/@types/types';
import { defineComponent, computed, ref } from 'vue';
import useHouseType from './houseTypeService';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteHouseTypeMutation,
  listHouseTypeQuery,
  createHouseTypeMutation,
  updateHouseTypeMutation,
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
    let { list, items, item } = useHouseType();

    let { loading: loadinglist } = list();

    const { mutate: deleteHouseType, onError, onDone } = useMutation(
      deleteHouseTypeMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteHouseType: {
                houseType: { id },
              },
            },
          }
        ) => {
          let data: Record<string, []> | null = cache.readQuery({
            query: listHouseTypeQuery,
          });
          if (data) {
            items.value = data.houseTypes.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listHouseTypeQuery,
              data: {
                houseTypes: items.value,
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
      mutate: createHouseType,
      loading: loadingCreate,
      onError: onErrorCreate,
      onDone: onDoneCreate,
    } = useMutation(createHouseTypeMutation, () => ({
      update: (
        cache,
        {
          data: {
            createHouseType: { houseType },
          },
        }
      ) => {
        const value: unknown = { ...houseType, ...item.value };

        const data: {
          houseTypes: Partial<HouseType>[];
        } | null = cache.readQuery({
          query: listHouseTypeQuery,
        });
        cache.writeQuery({
          query: listHouseTypeQuery,
          data: {
            houseTypes: [...(data?.houseTypes || []), value],
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
      mutate: updateHouseType,
      onError: onErrorUpdate,
      onDone: onDoneUpdate,
      loading: loadingUpdate,
    } = useMutation(updateHouseTypeMutation, () => ({
      update: (cache) => {
        const data: Record<string, HouseType[]> | null = cache.readQuery({
          query: listHouseTypeQuery,
        });
        if (data) items.value = data.houseTypes;
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
      deleteHouseType,
      loading: computed(
        () => loadinglist.value || loadingCreate.value || loadingUpdate
      ),
      formRef,
      onSubmit() {
        if (typeof item.value.id == 'undefined')
          void createHouseType({ input: item.value });
        else {
          const value = Object.assign({}, item.value) as HouseType;
          delete value.__typename;
          void updateHouseType({ input: value });
        }
      },
      edit(data: HouseType) {
        item.value = Object.assign({}, data);
      },
      remove(data: HouseType) {
        beforeRemove().onOk(() => {
          void deleteHouseType({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="House Types"
      :columns="columns"
      :rows="items"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-pagination
    >
      <template v-slot:top>
        <label class="text-h6">Houses Type</label>
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
