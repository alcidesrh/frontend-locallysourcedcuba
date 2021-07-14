<script lang="ts">
import { defineComponent } from 'vue';
import FormGuide from './guideForm/FormGuide.vue';
import useGuide from './guideService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateGuideMutation,
  listGuideQuery,
} from 'src/graphql/query/guide.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Guide } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, items, getItem, variablesListQuery } = useGuide();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const { mutate: updateGuide, onError, onDone, loading } = useMutation(
      updateGuideMutation,
      () => ({
        update: (cache) => {
          const data: Record<
            string,
            Record<string, Partial<Guide>[]>
          > | null = cache.readQuery({
            query: listGuideQuery,
            variables: variablesListQuery.value,
          });
          if (data) items.value = data.listGuides.collection;
        },
      })
    );

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListGuide' });
    });

    const onSubmit = () => {
      if (typeof item.value.bonus === 'string') {
        item.value.bonus = parseInt(item.value.bonus);
      }
      const value = Object.assign({}, item.value) as Partial<Guide>;
      delete value._id;
      delete value.__typename;

      void updateGuide({ input: value });
    };

    return {
      onSubmit,
      item,
      loading,
    };
  },
  components: { FormGuide },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">Edit Guide</div>
    <FormGuide v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
