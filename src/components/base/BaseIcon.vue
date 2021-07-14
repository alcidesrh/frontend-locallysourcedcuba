
<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: ['size'],
});
</script>
<template>
  <q-icon v-bind="$attrs" :style="{fontSize: size ? size+'px' : '18px'}" />
</template>