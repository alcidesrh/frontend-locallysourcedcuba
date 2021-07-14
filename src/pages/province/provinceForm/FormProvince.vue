<script lang="ts">
import useProvince from 'src/pages/province/provinceService';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    let { item } = useProvince();

    const router = useRouter();
    return {
      item,
      cancel() {
        void router.push({ name: 'ListProvince' });
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
      <div class="col-12 col-sm-8">
        <BaseInput name="name" v-model="item.name" label="Name*" validate="text"></BaseInput>
      </div>
      <div class="col-12 col-sm-4 flex flex-center">
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
