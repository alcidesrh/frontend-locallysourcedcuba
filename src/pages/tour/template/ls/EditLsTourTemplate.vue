<script lang="ts">
import { defineComponent } from 'vue';
import FormTourTemplate from './lsTourTemplateForm/FormLsTourTemplate.vue';
import useTourTemplate from './lsTourTemplateService';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  setup() {
    const { item, tourTemplateFormStep, getItem } = useTourTemplate();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    tourTemplateFormStep.value = 1;

    const router = useRouter();

    return {
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
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">Edit LS Tour Template</div>
      <div class="tw-flex tw-align-middle tw-justify-end">
        <BaseButton label="Back To The List" icon="arrow_back" type="button" @click="cancel" />
      </div>
    </div>
    <FormTourTemplate />
  </q-page>
</template>
