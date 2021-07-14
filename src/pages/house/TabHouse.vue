<template >
  <q-page padding>
    <q-tabs dense align="left" :breakpoint="0">
      <q-route-tab label="Accommodations" to="/houses" />
      <q-route-tab label="Types" to="/houses/type" />
      <q-route-tab label="Rooms" to="/houses/room" />
      <q-route-tab label="Features" to="/houses/feature" />
    </q-tabs>

    <router-view />
  </q-page>
</template>
