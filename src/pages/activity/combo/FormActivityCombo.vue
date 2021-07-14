<script lang="ts">
import useActivity from 'src/pages/activity/activityService';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import useDestination from 'src/pages/destination/destinationService';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteActivityComboMutation,
  createActivityComboMutation,
} from 'src/graphql/query/activity.graphql';
import { ActivityCombo } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    let { item, items, activitiesSelectCombo } = useActivity();

    if (item.value.activities && item.value.activities.length)
      activitiesSelectCombo.value = item.value.activities?.map((e) =>
        e && e.activity ? e.activity.id : ''
      );

    let { destinationsList, destinations } = useDestination();

    if (!destinations.value.length) destinationsList();

    const destinationsSelect = ref(destinations.value);

    const { mutate: deleteActivityCombo } = useMutation(
      deleteActivityComboMutation
    );
    const { mutate: createActivityCombo } = useMutation(
      createActivityComboMutation
    );

    const router = useRouter();
    return {
      item,
      items,
      destinationsSelect,
      activitiesSelectCombo,
      cancel() {
        void router.push({ name: 'ListActivityCombo' });
        item.value = {};
      },
      filterFn(val: string, update: (fn: () => void) => void) {
        if (val === '') {
          update(() => {
            destinationsSelect.value = destinations.value;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          destinationsSelect.value = destinations.value.filter((v) => {
            if (v.name) return v.name.toLowerCase().indexOf(needle) > -1;
            return false;
          });
        });
      },
      remove(data: Record<string, string>) {
        if (item.value.id) {
          const activity = item.value.activities?.find(
            (e) => e?.activity.id == data.value
          ) as ActivityCombo;
          void deleteActivityCombo({ input: { id: activity.id } });
        }
      },
      add(data: Record<string, string>) {
        if (item.value.id) {
          void createActivityCombo({
            input: {
              activity: data.value,
              parent: item.value.id,
            },
          });
        }
      },
    };
  },
  props: ['loading'],
  emits: ['submit'],
  methods: {
    onSubmit() {
      this.$emit('submit');
    },
  },
});
</script>


<template >
  <q-form @submit="onSubmit" class="q-mt-md">
    <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 xl:tw-grid-cols-4 tw-gap-4">
      <div>
        <BaseInput v-model="item.name" label="Name*" validate="text"></BaseInput>
      </div>
      <div>
        <BaseSelect
          v-model="item.destination"
          :options="destinationsSelect"
          label="Destinations"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          autocomplete
          use-input
          filter
          @filter="filterFn"
        ></BaseSelect>
      </div>
      <div class="tw-col-span-full xl:tw-col-span-2">
        <BaseSelect
          v-model="activitiesSelectCombo"
          :options="items.filter(i => i.type != 'combo')"
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
    <q-stepper-navigation class="tw-text-right">
      <BaseButton label="Cancel" type="button" color="primary" class="q-ml-sm" @click="cancel" />
      <BaseButton label="Save" type="submit" color="primary" class="q-ml-sm" :loading="loading" />
    </q-stepper-navigation>
  </q-form>
</template>
