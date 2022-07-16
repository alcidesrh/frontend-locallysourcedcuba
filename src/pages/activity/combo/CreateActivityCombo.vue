<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import FormActivityCombo from './FormActivityCombo.vue';
import useActivity from '../activityService';
import { useMutation } from '@vue/apollo-composable';
import {
  createActivityMutation,
  createActivityComboMutation,
} from 'src/graphql/query/activity.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Activity } from 'src/graphql/@types/types';
import request from 'src/api/request';

export default defineComponent({
  components: { FormActivityCombo },
  setup() {
    const { item, activitiesSelectCombo } = useActivity();

    item.value = { activities: [] };

    activitiesSelectCombo.value = [];

    const router = useRouter();

    const loadinCreateAcitvityCombo = ref(false);

    const {
      mutate: createActivity,
      loading: loadinCreateAcitvity,
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
        const value: Activity = { ...activity, ...item.value } as Activity;
        item.value = value;
      },
    }));

    async function createActivityCombo() {
      loadinCreateAcitvityCombo.value = true;
      if (activitiesSelectCombo.value.length) {
        for (let id of activitiesSelectCombo.value) {
          await request
            .mutate(createActivityComboMutation, {
              input: {
                activity: id,
                parent: item.value.id,
              },
            })
            .then(
              ({
                data: {
                  createActivityCombo: { activityCombo },
                },
              }) => {
                item.value.activities?.push(activityCombo);
              }
            );
        }
      }

      loadinCreateAcitvityCombo.value = false;

      void router.push({ name: 'ListActivityCombo' });
    }

    onDone(() => {
      void createActivityCombo();
    });
    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      void createActivity({ input: { ...item.value, type: 'combo' } });
    };

    return {
      loading: computed(
        () => loadinCreateAcitvity.value || loadinCreateAcitvityCombo.value
      ),
      cancel() {
        item.value = {};
        void router.push({ name: 'ListActivity' });
      },
      onSubmit,
    };
  },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">New Activity</div>
    </div>
    <FormActivityCombo @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
