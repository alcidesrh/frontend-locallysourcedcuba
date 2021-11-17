<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import { updateHtcTourMutation } from 'src/graphql/query/tour.graphql';
import useHtcTour from 'src/pages/tour/htc/htcTourService';
import useActivity from 'src/pages/activity/activityService';
import { Activity } from 'src/graphql/@types/types';
import { remove } from 'lodash-es';

export default defineComponent({
  setup() {
    let { item } = useHtcTour();

    const activitiesSelect = ref<string[]>([]);

    const { items: activities, list } = useActivity();

    const { getActivities, loading } = list();

    if (!activities.value.length) {
      getActivities();
      watch(activities, () => {
        activitiesSelect.value =
          item.value.activities?.map((e) => (e ? e.id : '')) || [];
      });
    } else {
      activitiesSelect.value =
        item.value.activities?.map((e) => (e ? e.id : '')) || [];
    }

    const {
      mutate: updateTour,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateHtcTourMutation, () => ({
      update: (
        cache,
        {
          data: {
            updateTour: {
              tour: { activities },
            },
          },
        }
      ) => {
        item.value.activities = activities as Activity[];
      },
    }));

    onErrorUpdate((e: Error) => {
      error(e);
    });

    return {
      item,
      loading: computed(() => loadingUpdate.value || loading.value),
      activities,
      activitiesSelect,
      remove(data: Record<string, string>) {
        remove(activitiesSelect.value, (v) => v == data.value);
        void updateTour({
          input: {
            id: item.value.id,
            activities: activitiesSelect.value,
          },
        });
      },
      add(data: Record<string, string>) {
        void updateTour({
          input: {
            id: item.value.id,
            activities: activitiesSelect.value.concat([data.value]),
          },
        });
      },
    };
  },
});
</script>


<template >
  <q-form class="q-mt-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-10">
        <BaseSelect
          :loading="loading"
          v-model="activitiesSelect"
          :options="activities"
          label="Activities"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          use-chips
          multiple
          @remove="remove"
          @add="add"
        ></BaseSelect>
      </div>
    </div>
  </q-form>
</template>
