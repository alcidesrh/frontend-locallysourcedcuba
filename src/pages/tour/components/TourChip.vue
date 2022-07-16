<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['tour'],

  // setup(props) {
  //   const { tour } = toRefs(props as Record<string, Tour>);

  //   return {
  //     tour,
  //   };
  // },
});
</script>

<template >
  <q-chip class="tw-mr-2 tw-py-3 tw-my-2" :style="{backgroundColor: tour.color}">
    <div class="tw-p-0 tw-font-semibold tw-text-white tw-flex tw-items-center">
      <label
        class="tw-bg-gray-700 tw-tracking-widest tw-cursor-pointer"
        style="border-radius: 50px; padding: 0px 10px;"
      >{{tour.code}}</label>
      <span class="tw-ml-3">
        <q-icon
          style="border-radius: 50px; font-size: 15px;"
          class="tw-mx-1 tw-bg-gray-100 tw-p-1 tw-cursor-pointer"
          :class="{'tw-text-gray-500': !n?.complete, 'text-teal': n?.complete}"
          v-for="(n, index) in tour.notifications"
          :key="index"
          :name="n?.icon"
        />
      </span>

      <slot />
    </div>
  </q-chip>
</template>
