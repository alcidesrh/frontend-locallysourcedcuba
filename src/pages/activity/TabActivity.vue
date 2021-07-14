<script>
import { defineComponent } from 'vue';
import useActivity from './activityService';

export default defineComponent({
  setup() {
    let { list } = useActivity();
    const { getActivities } = list();
    getActivities();
  }
});
</script>
<template >
  <q-page padding>
    <q-tabs dense align="left" :breakpoint="0">
      <q-route-tab label="Normal" to="/activities" />
      <q-route-tab label="Transport" to="/activities/transport" />
      <q-route-tab label="Combo" to="/activities/combo" />
    </q-tabs>

    <router-view />
  </q-page>
</template>
