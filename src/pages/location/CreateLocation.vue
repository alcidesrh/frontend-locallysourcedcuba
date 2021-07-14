<script lang="ts">
import { defineComponent } from 'vue';
import FormLocation from './locationForm/FormLocation.vue';
import useLocation from './locationService';
import { useMutation } from '@vue/apollo-composable';
import {
  createLocationMutation,
  listLocationQuery,
} from 'src/graphql/query/location.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Location } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, variablesListQuery } = useLocation();

    item.value = {};

    const { mutate: createLocation, loading, onError, onDone } = useMutation(
      createLocationMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              createLocation: { location },
            },
          }
        ) => {
          const value: unknown = { ...location, ...item.value };

          const data: {
            listLocations: {
              collection: Partial<Location>[];
              paginationInfo: Record<string, unknown>;
            };
          } | null = cache.readQuery({
            query: listLocationQuery,
            variables: variablesListQuery.value,
          });
          cache.writeQuery({
            query: listLocationQuery,
            data: {
              listLocations: {
                collection: [...(data?.listLocations.collection || []), value],
              },
            },
            variables: variablesListQuery.value,
          });
        },
      })
    );

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListLocation' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      void createLocation({ input: item.value });
    };

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListLocation' });
      },
      onSubmit,
    };
  },
  components: { FormLocation },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">New Location</div>
    <FormLocation @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
