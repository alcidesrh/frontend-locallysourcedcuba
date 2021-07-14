<script lang="ts">
import { defineComponent } from 'vue';
import FormProvince from 'src/pages/province/provinceForm/FormProvince.vue';
import useProvince from './provinceService';
import { useMutation } from '@vue/apollo-composable';
import { createMutation, listQuery } from 'src/graphql/query/province.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Province } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item } = useProvince();

    item.value = {};

    const { mutate: createProvince, loading, onError, onDone } = useMutation(
      createMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              createProvince: { province },
            },
          }
        ) => {
          const value: unknown = { ...province, ...item.value };

          const data: {
            provinces: Partial<Province>[];
          } | null = cache.readQuery({
            query: listQuery,
          });

          cache.writeQuery({
            query: listQuery,
            data: {
              provinces: [...(data?.provinces || []), value],
            },
          });
        },
      })
    );

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListProvince' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      void createProvince({ input: item.value });
    };

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListProvince' });
      },
      onSubmit,
    };
  },
  components: { FormProvince },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">New Province</div>
    <FormProvince @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
