<script lang="ts">
import { defineComponent } from 'vue';
import FormGuide from './guideForm/FormGuide.vue';
import useGuide from './guideService';
import { useMutation } from '@vue/apollo-composable';
import {
  createGuideMutation,
  listGuideQuery,
} from 'src/graphql/query/guide.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Guide } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, variablesListQuery } = useGuide();

    item.value = {};

    const { mutate: createGuide, loading, onError, onDone } = useMutation(
      createGuideMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              createGuide: { guide },
            },
          }
        ) => {
          const value: unknown = { ...guide, ...item.value };

          const data: {
            listGuides: {
              collection: Partial<Guide>[];
              paginationInfo: Record<string, unknown>;
            };
          } | null = cache.readQuery({
            query: listGuideQuery,
            variables: variablesListQuery.value,
          });
          cache.writeQuery({
            query: listGuideQuery,
            data: {
              listGuides: {
                collection: [...(data?.listGuides.collection || []), value],
              },
            },
            variables: variablesListQuery.value,
          });
        },
      })
    );

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListGuide' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      if (typeof item.value.bonus === 'string') {
        item.value.bonus = parseInt(item.value.bonus);
      }
      void createGuide({ input: item.value });
    };

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListGuide' });
      },
      onSubmit,
    };
  },
  components: { FormGuide },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">New Guide</div>
    <FormGuide @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
