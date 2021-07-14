<script lang="ts">
import { defineComponent } from 'vue';
import FormService from 'src/pages/service/serviceForm/FormService.vue';
import useService from './serviceService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateServiceMutation,
  listServiceQuery,
} from 'src/graphql/query/service.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Service } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, items, getItem } = useService();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const { mutate: update, onError, onDone, loading } = useMutation(
      updateServiceMutation,
      () => ({
        update: (cache) => {
          const data: Record<
            string,
            Partial<Service>[]
          > | null = cache.readQuery({
            query: listServiceQuery,
          });
          if (data) items.value = data.services;
        },
      })
    );

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListService' });
    });

    const onSubmit = () => {
      if (typeof item.value.daysToShow === 'string') {
        item.value.daysToShow = parseInt(item.value.daysToShow);
      }
      const value = Object.assign({}, item.value) as Partial<Service>;
      delete value._id;
      delete value.__typename;

      void update({ input: value });
    };

    return {
      onSubmit,
      item,
      loading,
    };
  },
  components: { FormService },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">Edit Service</div>
    <FormService v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
