<script lang="ts">
import { defineComponent } from 'vue';
import FormActivityTransport from './FormActivityTransport.vue';
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

    const {
      mutate: createActivity,
      loading,
      onError,
      onDone,
    } = useMutation(createActivityMutation, () => ({
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
    }));

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListActivityTransport' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      if (typeof item.value.carCost === 'string') {
        item.value.carCost = parseInt(item.value.carCost);
      }
      if (typeof item.value.personPerCar === 'string') {
        item.value.personPerCar = parseInt(item.value.personPerCar);
      }
      void createActivity({ input: { ...item.value, type: 'transport' } });
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
  components: { FormActivityTransport },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">New Activity</div>
    </div>
    <FormActivityTransport @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
