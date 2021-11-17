<script lang="ts">
import { defineComponent, watch, provide } from 'vue';
import FormTour from './lsTourForm/FormLsTour.vue';
import useTour from './lsTourService';
import { useRouter, useRoute } from 'vue-router';
import globalLoading from 'src/store/loading';

export default defineComponent({
  setup() {
    provide('edit', true);
    const { tourFormStep, getItem, item } = useTour();

    item.value = {};

    const route = useRoute();

    const { loading } = getItem(route.params.id as string);

    globalLoading.value = true;
    watch([loading], ([v]) => (globalLoading.value = v));

    tourFormStep.value = 1;

    const router = useRouter();

    return {
      cancel() {
        void router.push({ name: 'ListLsTour' });
      },
    };
  },
  components: { FormTour },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">Edit LS Tour</div>
      <div class="tw-flex tw-align-middle tw-justify-end">
        <BaseButton label="Back To The List" icon="arrow_back" type="button" @click="cancel" />
      </div>
    </div>
    <FormTour />
  </q-page>
</template>
