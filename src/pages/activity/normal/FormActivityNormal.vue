<script lang="ts">
import useActivity from 'src/pages/activity/activityService';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import useDestination from 'src/pages/destination/destinationService';

export default defineComponent({
  setup() {
    let { item } = useActivity();

    let { destinationsList, destinations } = useDestination();

    if (!destinations.value.length) destinationsList();

    const destinationsSelect = ref(destinations.value);

    const router = useRouter();
    return {
      item,
      destinationsSelect,
      cancel() {
        void router.push({ name: 'ListActivityNormal' });
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
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4">
        <BaseInput v-model="item.name" label="Name*" validate="text"></BaseInput>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
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
      <div class="col-12 col-sm-6 col-md-2">
        <BaseInput v-model="item.personCost" label="Person Cost" type="number"></BaseInput>
      </div>
      <div class="col-12 col-sm-6 col-md-2">
        <BaseInput v-model="item.guideCost" label="Guide Cost" type="number"></BaseInput>
      </div>
    </div>
    <q-stepper-navigation class="tw-text-right">
      <BaseButton label="Cancel" type="button" color="primary" class="q-ml-sm" @click="cancel" />
      <BaseButton label="Save" type="submit" color="primary" class="q-ml-sm" :loading="loading" />
    </q-stepper-navigation>
  </q-form>
</template>
