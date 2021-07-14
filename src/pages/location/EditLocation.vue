<script lang="ts">
import { defineComponent } from 'vue';
import FormLocation from './locationForm/FormLocation.vue';
import useLocation from './locationService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateLocationMutation,
  listLocationQuery,
} from 'src/graphql/query/location.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Location } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, items, getItem, variablesListQuery } = useLocation();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const { mutate: updateLocation, onError, onDone, loading } = useMutation(
      updateLocationMutation,
      () => ({
        update: (cache) => {
          const data: Record<
            string,
            Record<string, Partial<Location>[]>
          > | null = cache.readQuery({
            query: listLocationQuery,
            variables: variablesListQuery.value,
          });
          if (data) items.value = data.listLocations.collection;
        },
      })
    );

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListLocation' });
    });

    const onSubmit = () => {
      const value = Object.assign({}, item.value) as Partial<Location>;

      void updateLocation({ input: value });
    };

    return {
      onSubmit,
      item,
      loading,
    };
  },
  components: { FormLocation },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">Edit Location</div>
    <FormLocation v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
