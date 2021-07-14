<script lang="ts">
import { defineComponent } from 'vue';
import FormService from 'src/pages/service/serviceForm/FormService.vue';
import useService from './serviceService';
import { useMutation } from '@vue/apollo-composable';
import {
  createServiceMutation,
  listServiceQuery,
} from 'src/graphql/query/service.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Service } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item } = useService();

    item.value = {};

    const { mutate: createService, loading, onError, onDone } = useMutation(
      createServiceMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              createService: { service },
            },
          }
        ) => {
          const value: unknown = { ...service, ...item.value };

          const data: {
            services: Partial<Service>[];
          } | null = cache.readQuery({
            query: listServiceQuery,
          });

          cache.writeQuery({
            query: listServiceQuery,
            data: {
              services: [...(data?.services || []), value],
            },
          });
        },
      })
    );

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListService' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      if (typeof item.value.daysToShow === 'string') {
        item.value.daysToShow = parseInt(item.value.daysToShow);
      }
      void createService({ input: item.value });
    };

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListService' });
      },
      onSubmit,
    };
  },
  components: { FormService },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">New Service</div>
    <FormService @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
