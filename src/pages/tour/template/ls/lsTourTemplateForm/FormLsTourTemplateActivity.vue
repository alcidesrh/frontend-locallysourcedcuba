<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import {
  updateLsTourTemplateMutation,
  listLsTourTemplateQuery,
} from 'src/graphql/query/tourTemplate.graphql';
import useLsTourTemplate from 'src/pages/tour/template/ls/lsTourTemplateService';
import useActivity from 'src/pages/activity/activityService';
import { TourTemplate } from 'src/graphql/@types/types';
import { remove } from 'lodash-es';

export default defineComponent({
  setup() {
    let { items, item } = useLsTourTemplate();

    const activitiesSelect = ref<string[]>([]);

    const { items: activities, list } = useActivity();

    if (!activities.value.length) {
      const { getActivities } = list();
      getActivities();
      watch(
        activities,
        () =>
          (activitiesSelect.value =
            item.value.activities?.map((e) => (e ? e.id : '')) || [])
      );
    } else
      activitiesSelect.value =
        item.value.activities?.map((e) => (e ? e.id : '')) || [];

    const {
      mutate: updateTourTemplate,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateLsTourTemplateMutation, () => ({
      update: (cache) => {
        const data: {
          tourTemplates: Partial<TourTemplate>[];
        } | null = cache.readQuery({
          query: listLsTourTemplateQuery,
        });
        if (data) {
          items.value = data.tourTemplates;
        }
      },
    }));

    onErrorUpdate((e: Error) => {
      error(e);
    });

    return {
      item,
      loading: computed(() => loadingUpdate.value),
      activities,
      activitiesSelect,
      remove(data: Record<string, string>) {
        remove(activitiesSelect.value, (v) => v == data.value);
        void updateTourTemplate({
          input: {
            id: item.value.id,
            activities: activitiesSelect.value,
          },
        });
      },
      add(data: Record<string, string>) {
        void updateTourTemplate({
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
