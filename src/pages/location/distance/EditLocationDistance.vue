<script lang="ts">
import { defineComponent } from 'vue';
import FormLocationDistance from './locationDistanceForm/FormLocationDistance.vue';
import useLocationDistance from './locationDistanceService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateLocationDistanceMutation,
  listLocationDistanceQuery,
} from 'src/graphql/query/location.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { LocationDistance } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, items, getItem, variablesListQuery } = useLocationDistance();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const {
      mutate: updateLocationDistance,
      onError,
      onDone,
      loading,
    } = useMutation(updateLocationDistanceMutation, () => ({
      update: (cache) => {
        const data: Record<
          string,
          Record<string, Partial<LocationDistance>[]>
        > | null = cache.readQuery({
          query: listLocationDistanceQuery,
          variables: variablesListQuery.value,
        });
        if (data) items.value = data.listLocationDistances.collection;
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListLocationDistance' });
    });

    const onSubmit = () => {
      if (typeof item.value.kms === 'string') {
        item.value.kms = parseInt(item.value.kms);
      }
      const value = Object.assign({}, item.value) as Partial<LocationDistance>;

      void updateLocationDistance({
        input: {
          ...value,
          location1: value.location1?.id || value.location1,
          location2: value.location2?.id || value.location2,
        },
      });
    };

    return {
      onSubmit,
      item,
      loading,
    };
  },
  components: { FormLocationDistance },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">Edit Location Distance</div>
    <FormLocationDistance v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
