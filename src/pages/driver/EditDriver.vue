<script lang="ts">
import { defineComponent } from 'vue';
import FormDriver from './driverForm/FormDriver.vue';
import useDriver from './driverService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateDriverMutation,
  listDriverQuery,
} from 'src/graphql/query/driver.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Driver } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, items, getItem, variablesListQuery } = useDriver();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const { mutate: updateDriver, onError, onDone, loading } = useMutation(
      updateDriverMutation,
      () => ({
        update: (cache) => {
          const data: Record<
            string,
            Record<string, Partial<Driver>[]>
          > | null = cache.readQuery({
            query: listDriverQuery,
            variables: variablesListQuery.value,
          });
          if (data) items.value = data.listDrivers.collection;
        },
      })
    );

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListDriver' });
    });

    const onSubmit = () => {
      if (typeof item.value.pax === 'string') {
        item.value.pax = parseInt(item.value.pax);
      }
      const value = Object.assign({}, item.value) as Partial<Driver>;
      delete value._id;
      delete value.__typename;

      void updateDriver({ input: value });
    };

    return {
      onSubmit,
      item,
      loading,
    };
  },
  components: { FormDriver },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">Edit Driver</div>
    <FormDriver v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
