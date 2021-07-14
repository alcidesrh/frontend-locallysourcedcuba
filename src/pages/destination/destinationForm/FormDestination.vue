<script lang="ts">
import useDestination from 'src/pages/destination/destinationService';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import useProvince from 'src/pages/province/provinceService';

export default defineComponent({
  setup() {
    let { item } = useDestination();

    const { items: provinces } = useProvince();

    if (!provinces.value.length) {
      const { list } = useProvince();
      list();
    }

    const router = useRouter();
    return {
      item,
      provinces,
      cancel() {
        void router.push({ name: 'ListDestination' });
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
        <BaseSelect
          v-model="item.province"
          :display-value="item.province?.name"
          :options="provinces"
          label="Province"
          option-label="name"
          validate
        ></BaseSelect>
      </div>
    </div>

    <div class="flex justify-end q-mt-lg">
      <BaseButton label="Cancel" type="button" @click="cancel" color="primary" />
      <BaseButton label="Submit" type="submit" color="primary" class="q-ml-sm" :loading="loading" />
    </div>
  </q-form>
</template>
