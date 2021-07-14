<script lang="ts">
import useLocationDistance from 'src/pages/location/distance/locationDistanceService';
import useLocation from 'src/pages/location/locationService';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    let { item } = useLocationDistance();

    let { locations, lazyList } = useLocation();

    if (!locations.value.length) {
      const { getLocations } = lazyList();
      getLocations();
    }

    const router = useRouter();
    return {
      item,
      locations,
      cancel() {
        void router.push({ name: 'ListLocationDistance' });
        item.value = {};
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
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6 col-md-4">
        <BaseSelect
          v-model="item.location1"
          :options="locations"
          label="From"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          validate
        ></BaseSelect>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <BaseSelect
          v-model="item.location2"
          :options="locations"
          label="To"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          validate
        ></BaseSelect>
      </div>
      <div class="col-12 col-sm-6 col-md-2">
        <BaseInput v-model="item.kms" label="Km" validate type="number"></BaseInput>
      </div>
      <div class="col-12 tw-flex tw-items-center tw-justify-end">
        <BaseButton label="Cancel" type="button" @click="cancel" color="primary" />
        <BaseButton
          label="Submit"
          type="submit"
          color="primary"
          class="q-ml-sm"
          :loading="loading"
        />
      </div>
    </div>
  </q-form>
</template>
