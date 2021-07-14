<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    let rule: unknown;

    return { rule };
  },
});
</script>
<template>
  <q-date v-bind="$attrs" mask="YYYY-MM-DD HH:mm">
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-date>
</template>