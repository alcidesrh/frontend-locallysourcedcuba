<script lang="ts">
import useService from 'src/pages/service/serviceService';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    let { item } = useService();

    const router = useRouter();
    return {
      item,
      cancel() {
        void router.push({ name: 'ListService' });
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
        <BaseInput v-model="item.name" label="Name*" validate="text"></BaseInput>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <BaseInput v-model="item.code" label="Code"></BaseInput>
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <BaseInput v-model="item.daysToShow" label="Days to Show" type="number"></BaseInput>
      </div>
    </div>

    <div class="flex justify-end q-mt-lg">
      <BaseButton label="Cancel" type="button" @click="cancel" color="primary" />
      <BaseButton label="Submit" type="submit" color="primary" class="q-ml-sm" :loading="loading" />
    </div>
  </q-form>
</template>
