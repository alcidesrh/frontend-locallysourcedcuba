<script lang="ts">
import { defineComponent } from 'vue';
import FormActivityNormal from './FormActivityNormal.vue';
import useActivity from '../activityService';
import { useMutation } from '@vue/apollo-composable';
import {
  createActivityMutation,
  listActivityQuery,
} from 'src/graphql/query/activity.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Activity } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, variablesListQuery } = useActivity();

    item.value = {};

    const { mutate: createActivity, loading, onError, onDone } = useMutation(
      createActivityMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              createActivity: { activity },
            },
          }
        ) => {
          const value: unknown = { ...activity, ...item.value };

          item.value = value as Activity;

          const data: {
            listActivities: Partial<Activity>[];
          } | null = cache.readQuery({
            query: listActivityQuery,
            variables: variablesListQuery.value,
          });
          cache.writeQuery({
            query: listActivityQuery,
            data: {
              listActivities: [...(data?.listActivities || []), value],
            },
            variables: variablesListQuery.value,
          });
        },
      })
    );

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListActivityNormal' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      if (typeof item.value.guideCost === 'string') {
        item.value.guideCost = parseInt(item.value.guideCost);
      }
      if (typeof item.value.personCost === 'string') {
        item.value.personCost = parseInt(item.value.personCost);
      }
      void createActivity({ input: { ...item.value, type: 'normal' } });
    };

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListActivity' });
      },
      onSubmit,
    };
  },
  components: { FormActivityNormal },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">New Activity</div>
    </div>
    <FormActivityNormal @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
