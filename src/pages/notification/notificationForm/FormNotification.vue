<script lang="ts">
import useNotification from 'src/pages/notification/notificationService';
import useService from 'src/pages/service/serviceService';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  setup() {
    let { item } = useNotification();

    const { items: services } = useService();

    if (!services.value.length) {
      const { list } = useService();
      list();
    }

    const router = useRouter();
    return {
      item,
      services,
      cancel() {
        void router.push({ name: 'ListNotification' });
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
    <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 md:tw-grid-cols-3 tw-gap-3">
      <div>
        <BaseInput v-model="item.name" label="Name*" validate="text"></BaseInput>
      </div>
      <div>
        <BaseInput
          v-model="item.icon"
          label="Icon"
          hint="Pick icon from https://fonts.google.com/icons"
        >
          <template v-slot:prepend>
            <q-icon v-if="item.icon" :name="item.icon" class="notification-icon-color" />
          </template>
        </BaseInput>
      </div>
      <div>
        <BaseInput v-model="item.days" label="Days" type="number"></BaseInput>
      </div>
      <div>
        <BaseSelect
          v-model="item.services"
          :options="services"
          label="Services"
          option-label="name"
          multiple
          option-value="id"
          use-chips
        ></BaseSelect>
      </div>
    </div>

    <div class="flex justify-end q-mt-lg">
      <BaseButton label="Cancel" type="button" @click="cancel" color="primary" />
      <BaseButton label="Submit" type="submit" color="primary" class="q-ml-sm" :loading="loading" />
    </div>
  </q-form>
</template>
