<script lang="ts">
import { defineComponent } from 'vue';
import FormDestination from './destinationForm/FormDestination.vue';
import useDestination from './destinationService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateDestinationMutation,
  listDestinationQuery,
} from 'src/graphql/query/destination.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Destination } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, items, getItem, variablesListQuery } = useDestination();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const { mutate: updateDestination, onError, onDone, loading } = useMutation(
      updateDestinationMutation,
      () => ({
        update: (cache) => {
          const data: Record<
            string,
            Record<string, Partial<Destination>[]>
          > | null = cache.readQuery({
            query: listDestinationQuery,
            variables: variablesListQuery.value,
          });
          if (data) items.value = data.listDestinations.collection;
        },
      })
    );

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListDestination' });
    });

    const onSubmit = () => {
      const value = Object.assign({}, item.value);
      const id = value.province?.id;
      delete value.province;
      void updateDestination({ input: { ...value, province: id } });
    };

    return {
      onSubmit,
      item,
      loading,
    };
  },
  components: { FormDestination },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">Edit Destination</div>
    <FormDestination v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
