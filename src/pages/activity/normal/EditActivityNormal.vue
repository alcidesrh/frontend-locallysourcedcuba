<script lang="ts">
import { defineComponent } from 'vue';
import FormActivityNormal from './FormActivityNormal.vue';
import useActivity from '../activityService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateActivityMutation,
  listActivityQuery,
} from 'src/graphql/query/activity.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Activity } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, items, getItem, variablesListQuery } = useActivity();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const { mutate: updateActivity, onError, onDone, loading } = useMutation(
      updateActivityMutation,
      () => ({
        update: (cache) => {
          const data: Record<
            string,
            Partial<Activity>[]
          > | null = cache.readQuery({
            query: listActivityQuery,
            variables: variablesListQuery.value,
          });
          if (data) items.value = data.listActivities;
        },
      })
    );

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListActivityNormal' });
      item.value = {};
    });

    const onSubmit = () => {
      if (typeof item.value.guideCost === 'string') {
        item.value.guideCost = parseInt(item.value.guideCost);
      }
      if (typeof item.value.personCost === 'string') {
        item.value.personCost = parseInt(item.value.personCost);
      }
      void updateActivity({
        input: {
          ...item.value,
          ...{
            destination: item.value.destination?.id || item.value.destination,
          },
        },
      });
    };

    return {
      onSubmit,
      item,
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListActivityNormal' });
      },
    };
  },
  components: { FormActivityNormal },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">Edit Activity</div>
    </div>
    <FormActivityNormal v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
