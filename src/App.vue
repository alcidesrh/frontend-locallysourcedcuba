<template>
  <router-view />
</template>
<script lang="ts">
import { defineComponent } from 'vue';
// import { useRouter } from 'vue-router';
// import { onMounted } from 'vue';

export default defineComponent({
  name: 'App',
  setup() {
    // const router = useRouter();
    // onMounted(() => {
    //   alert(router.currentRoute.value.path);
    //   void router.push({ name: 'SheduleGuide' });
    // });
  },
});
</script>
