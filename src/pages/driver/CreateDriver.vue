<script lang="ts">
import { defineComponent } from 'vue';
import FormDriver from './driverForm/FormDriver.vue';
import useDriver from './driverService';
import { useMutation } from '@vue/apollo-composable';
import {
  createDriverMutation,
  listDriverQuery,
} from 'src/graphql/query/driver.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Driver } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, variablesListQuery } = useDriver();

    item.value = {};

    const { mutate: createDriver, loading, onError, onDone } = useMutation(
      createDriverMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              createDriver: { driver },
            },
          }
        ) => {
          const value: unknown = { ...driver, ...item.value };

          const data: {
            listDrivers: {
              collection: Partial<Driver>[];
              paginationInfo: Record<string, unknown>;
            };
          } | null = cache.readQuery({
            query: listDriverQuery,
            variables: variablesListQuery.value,
          });
          cache.writeQuery({
            query: listDriverQuery,
            data: {
              listDrivers: {
                collection: [...(data?.listDrivers.collection || []), value],
              },
            },
            variables: variablesListQuery.value,
          });
        },
      })
    );

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListDriver' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      if (typeof item.value.pax === 'string') {
        item.value.pax = parseInt(item.value.pax);
      }
      void createDriver({ input: item.value });
    };

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListDriver' });
      },
      onSubmit,
    };
  },
  components: { FormDriver },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">New Driver</div>
    <FormDriver @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
