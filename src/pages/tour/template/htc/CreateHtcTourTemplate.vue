<script lang="ts">
import { defineComponent } from 'vue';
import FormTourTemplate from './htcTourTemplateForm/FormHtcTourTemplate.vue';
import useTourTemplate from './htcTourTemplateService';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    const { item, tourTemplateFormStep } = useTourTemplate();

    item.value = {};

    tourTemplateFormStep.value = 1;

    const router = useRouter();

    return {
      cancel() {
        item.value = {};
        void router.push({ name: 'ListHtcTourTemplate' });
      },
    };
  },
  components: { FormTourTemplate },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">New Tour Template</div>
      <div class="tw-flex tw-align-middle tw-justify-end">
        <BaseButton label="Back To The List" icon="arrow_back" type="button" @click="cancel" />
      </div>
    </div>
    <FormTourTemplate />
  </q-page>
</template>
