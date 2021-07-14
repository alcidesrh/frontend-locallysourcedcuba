<script lang="ts">
import { defineComponent } from 'vue';
import FormHouse from './houseForm/FormHouse.vue';
import useHouse from './houseService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateHouseMutation,
  listHouseQuery,
} from 'src/graphql/query/house.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { House } from 'src/graphql/@types/types';
import { pick } from 'lodash-es';

export default defineComponent({
  setup() {
    const { item, items, getItem, variablesListQuery, houseFormStep } =
      useHouse();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const {
      mutate: updateHouse,
      onError,
      onDone,
      loading,
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

    onError((e: Error) => {
      error(e);
    });

    onDone(() => {
      houseFormStep.value = 2;
    });

    const onSubmit = () => {
      const value = pick(item.value, [
        'id',
        'name',
        'address',
        'phone',
        'email',
        'description',
      ]);

      void updateHouse({
        input: {
          ...value,
          ...{
            destination: item.value.destination?.id || item.value.destination,
            type: item.value.type?.id || item.value.type,
            features: item.value.features?.map((f) => f?.id || f),
          },
        },
      });
    };

    const router = useRouter();

    return {
      onSubmit,
      item,
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListHouse' });
      },
    };
  },
  components: { FormHouse },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">Edit House</div>
      <div class="tw-flex tw-align-middle tw-justify-end">
        <BaseButton label="Back To The List" icon="arrow_back" type="button" @click="cancel" />
      </div>
    </div>
    <FormHouse v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
