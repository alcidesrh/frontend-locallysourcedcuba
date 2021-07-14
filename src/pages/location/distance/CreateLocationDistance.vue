<script lang="ts">
import { defineComponent } from 'vue';
import FormLocationDistance from './locationDistanceForm/FormLocationDistance.vue';
import useLocationDistance from './locationDistanceService';
import { useMutation } from '@vue/apollo-composable';
import {
  createLocationDistanceMutation,
  listLocationDistanceQuery,
} from 'src/graphql/query/location.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { LocationDistance } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, variablesListQuery } = useLocationDistance();

    item.value = {};

    const {
      mutate: createLocationDistance,
      loading,
      onError,
      onDone,
    } = useMutation(createLocationDistanceMutation, () => ({
      update: (
        cache,
        {
          data: {
            createLocationDistance: { locationDistance },
          },
        }
      ) => {
        const value: unknown = { ...locationDistance, ...item.value };

        const data: {
          listLocationDistances: {
            collection: Partial<LocationDistance>[];
            paginationInfo: Record<string, unknown>;
          };
        } | null = cache.readQuery({
          query: listLocationDistanceQuery,
          variables: variablesListQuery.value,
        });
        cache.writeQuery({
          query: listLocationDistanceQuery,
          data: {
            listLocationDistances: {
              collection: [
                ...(data?.listLocationDistances.collection || []),
                value,
              ],
            },
          },
          variables: variablesListQuery.value,
        });
      },
    }));

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListLocationDistance' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      if (typeof item.value.kms === 'string') {
        item.value.kms = parseInt(item.value.kms);
      }
      void createLocationDistance({ input: item.value });
    };

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListLocationDistance' });
      },
      onSubmit,
    };
  },
  components: { FormLocationDistance },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">New Location Distance</div>
    <FormLocationDistance @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
