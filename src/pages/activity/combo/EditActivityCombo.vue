<script lang="ts">
import { defineComponent } from 'vue';
import FormActivityCombo from './FormActivityCombo.vue';
import useActivity from '../activityService';
import { useMutation } from '@vue/apollo-composable';

import { updateActivityMutation } from 'src/graphql/query/activity.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { omit } from 'lodash-es';

export default defineComponent({
  setup() {
    const { item, getItem, activitiesSelectCombo } = useActivity();

    const route = useRoute();

    activitiesSelectCombo.value = [];

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    } else if (item.value.activities && item.value.activities.length)
      activitiesSelectCombo.value = item.value.activities?.map((e) =>
        e && e.activity ? e.activity.id : ''
      );

    const { mutate: updateActivity, onError, onDone, loading } = useMutation(
      updateActivityMutation
    );

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      item.value = {};
      void router.push({ name: 'ListActivityCombo' });
    });

    const onSubmit = () => {
      void updateActivity({
        input: {
          ...omit(item.value, ['activities']),
          destination: item.value.destination?.id || item.value.destination,
        },
      });
    };

    return {
      onSubmit,
      item,
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListActivityCombo' });
      },
    };
  },
  components: { FormActivityCombo },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">Edit Activity</div>
    </div>
    <FormActivityCombo v-if="item.id" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
