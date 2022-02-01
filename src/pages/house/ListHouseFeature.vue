<script lang="ts">
import { HouseFeature } from 'src/graphql/@types/types';
import { defineComponent, computed, ref } from 'vue';
import useHouseFeature from './houseFeatureService';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteHouseFeatureMutation,
  listHouseFeatureQuery,
  createHouseFeatureMutation,
  updateHouseFeatureMutation,
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
    let { list, items, item } = useHouseFeature();

    let { loading: loadinglist } = list();

    const {
      mutate: deleteHouseFeature,
      onError,
      onDone,
    } = useMutation(deleteHouseFeatureMutation, () => ({
      update: (
        cache,
        {
          data: {
            deleteHouseFeature: {
              houseFeature: { id },
            },
          },
        }
      ) => {
        let data: Record<string, []> | null = cache.readQuery({
          query: listHouseFeatureQuery,
        });
        if (data) {
          items.value = data.houseFeatures.filter(
            (i: { id: string }) => i.id != id
          );

          cache.writeQuery({
            query: listHouseFeatureQuery,
            data: {
              houseFeatures: items.value,
            },
          });
        }
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    onDone(() => {
      success({ message: 'The item have been deleted.' });
    });

    const {
      mutate: createHouseFeature,
      loading: loadingCreate,
      onError: onErrorCreate,
      onDone: onDoneCreate,
    } = useMutation(createHouseFeatureMutation, () => ({
      update: (
        cache,
        {
          data: {
            createHouseFeature: { houseFeature },
          },
        }
      ) => {
        const value: unknown = { ...houseFeature, ...item.value };

        const data: {
          houseFeatures: Partial<HouseFeature>[];
        } | null = cache.readQuery({
          query: listHouseFeatureQuery,
        });
        cache.writeQuery({
          query: listHouseFeatureQuery,
          data: {
            houseFeatures: [...(data?.houseFeatures || []), value],
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
      mutate: updateHouseFeature,
      onError: onErrorUpdate,
      onDone: onDoneUpdate,
      loading: loadingUpdate,
    } = useMutation(updateHouseFeatureMutation, () => ({
      update: (cache) => {
        const data: Record<string, HouseFeature[]> | null = cache.readQuery({
          query: listHouseFeatureQuery,
        });
        if (data) items.value = data.houseFeatures;
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
      loading: computed(
        () => loadinglist.value || loadingCreate.value || loadingUpdate
      ),
      formRef,
      onSubmit() {
        if (typeof item.value.id == 'undefined')
          void createHouseFeature({ input: item.value });
        else {
          const value = Object.assign({}, item.value) as HouseFeature;
          delete value.__typename;
          void updateHouseFeature({ input: value });
        }
      },
      edit(data: HouseFeature) {
        item.value = Object.assign({}, data);
      },
      remove(data: HouseFeature) {
        beforeRemove().onOk(() => {
          void deleteHouseFeature({ input: { id: data.id } });
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
        <label class="text-h6">House Features</label>
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
