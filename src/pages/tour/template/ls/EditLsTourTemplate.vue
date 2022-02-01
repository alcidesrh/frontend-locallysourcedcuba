<script lang="ts">
import { defineComponent, watch } from 'vue';
import FormTourTemplate from './lsTourTemplateForm/FormLsTourTemplate.vue';
import useTourTemplate from './lsTourTemplateService';
import { useRouter, useRoute } from 'vue-router';
import globalLoading from 'src/store/loading';

export default defineComponent({
  setup() {
    const { item, tourTemplateFormStep, getItem } = useTourTemplate();

    const route = useRoute();

    globalLoading.value = true;
    const { loading } = getItem(route.params.id as string);
    watch([loading], ([v]) => (globalLoading.value = v));

    tourTemplateFormStep.value = 1;

    const router = useRouter();

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListLsTourTemplate' });
      },
    };
  },
  components: { FormTourTemplate },
});
</script>

<template>
  <q-page padding :class="{'tw-opacity-50': loading}">
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">Edit LS Tour Template</div>
      <div class="tw-flex tw-align-middle tw-justify-end">
        <BaseButton label="Back To The List" icon="arrow_back" type="button" @click="cancel" />
      </div>
    </div>
    <FormTourTemplate />
  </q-page>
</template>
