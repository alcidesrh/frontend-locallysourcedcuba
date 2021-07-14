<script lang="ts">
import { defineComponent } from 'vue';
import FormHouse from './houseForm/FormHouse.vue';
import useHouse from './houseService';
import { useMutation } from '@vue/apollo-composable';
import {
  createHouseMutation,
  listHouseQuery,
  updateHouseMutation,
} from 'src/graphql/query/house.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { House } from 'src/graphql/@types/types';
import { pick } from 'lodash-es';

export default defineComponent({
  setup() {
    const { items, item, variablesListQuery, houseFormStep } = useHouse();

    item.value = {};

    houseFormStep.value = 1;

    const {
      mutate: createHouse,
      loading,
      onError,
      onDone,
    } = useMutation(createHouseMutation, () => ({
      update: (
        cache,
        {
          data: {
            createHouse: { house },
          },
        }
      ) => {
        const value: unknown = { ...house, ...item.value };

        item.value = value as House;

        const data: {
          listHouses: {
            collection: Partial<House>[];
            paginationInfo: Record<string, unknown>;
          };
        } | null = cache.readQuery({
          query: listHouseQuery,
          variables: variablesListQuery.value,
        });
        cache.writeQuery({
          query: listHouseQuery,
          data: {
            listHouses: {
              collection: [...(data?.listHouses.collection || []), value],
            },
          },
          variables: variablesListQuery.value,
        });
      },
    }));

    const router = useRouter();

    onDone(() => {
      item.value.rooms = [];
      item.value.houseSeasons = [];
      houseFormStep.value = 2;
    });

    onError((e: Error) => {
      error(e);
    });

    const {
      mutate: updateHouse,
      onError: onErrorUpdate,
      onDone: onDoneUpdate,
      loading: loadingUpdate,
    } = useMutation(updateHouseMutation, () => ({
      update: (cache) => {
        const data: Record<string, Record<string, Partial<House>[]>> | null =
          cache.readQuery({
            query: listHouseQuery,
            variables: variablesListQuery.value,
          });
        if (data) items.value = data.listHouses.collection;
      },
    }));

    onErrorUpdate((e: Error) => {
      error(e);
    });

    onDoneUpdate(() => {
      houseFormStep.value = 2;
    });

    const onSubmit = () => {
      if (item.value.id) {
        const value = pick(item.value, [
          'id',
          'name',
          'address',
          'phone',
          'email',
          'description',
          'destination',
          'type',
          'features',
        ]);

        void updateHouse({
          input: value,
        });
      } else void createHouse({ input: item.value });
    };

    return {
      loading,
      loadingUpdate,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListHouse' });
      },
      onSubmit,
    };
  },
  components: { FormHouse },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">New House</div>
      <div class="tw-flex tw-align-middle tw-justify-end">
        <BaseButton label="Back To The List" icon="arrow_back" type="button" @click="cancel" />
      </div>
    </div>
    <FormHouse @submit="onSubmit" @cancel="cancel" :loading="loading || loadingUpdate" />
  </q-page>
</template>
