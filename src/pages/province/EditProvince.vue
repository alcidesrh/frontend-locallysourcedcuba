<script lang="ts">
import { defineComponent } from 'vue';
import FormProvince from 'src/pages/province/provinceForm/FormProvince.vue';
import useProvince from './provinceService';
import { useMutation } from '@vue/apollo-composable';

import { updateMutation, listQuery } from 'src/graphql/query/province.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Province } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, items, getItem } = useProvince();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const { mutate: update, onError, onDone, loading } = useMutation(
      updateMutation,
      () => ({
        update: (cache) => {
          const data: Record<
            string,
            Partial<Province>[]
          > | null = cache.readQuery({
            query: listQuery,
          });
          if (data) items.value = data.provinces;
        },
      })
    );

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListProvince' });
    });

    const onSubmit = () => {
      const value = Object.assign({}, item.value) as Partial<Province>;
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
  components: { FormProvince },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">Edit Province</div>
    <FormProvince v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
