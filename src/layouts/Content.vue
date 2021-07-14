
<script>
import { ref, defineComponent } from 'vue';

const menuRight = [
  {
    text: 'LS Tour Template',
    icon: 'format_list_bulleted',
    active: 'ls-tour-templates',
    link: '/ls-tour-templates'
  },
  {
    text: 'HTC Tour Template',
    icon: 'format_list_bulleted',
    active: 'htc-tour-templates',
    link: '/htc-tour-templates'
  },
  {
    text: 'Notification',
    icon: 'notifications_active',
    active: 'notification',
    link: '/notifications'
  },
  {
    text: 'Accommodation',
    icon: 'home',
    active: 'house',
    link: '/houses'
  },
  {
    text: 'Activity',
    icon: 'local_activity',
    active: 'activity',
    link: '/activities'
  },
  {
    text: 'Destination',
    icon: 'location_on',
    active: 'destination',
    link: '/destinations'
  },
  {
    text: 'Guide',
    icon: 'directions_walk',
    active: 'guide',
    link: '/guides'
  },
  {
    text: 'Driver',
    icon: 'directions_car',
    active: 'driver',
    link: '/drivers'
  },
  {
    text: 'Transportation',
    icon: 'emoji_transportation',
    active: 'transportation',
    link: '/transportations'
  },
  {
    text: 'Services',
    icon: 'miscellaneous_services',
    active: 'service',
    link: '/services'
  },
  {
    text: 'Province',
    icon: 'add_location',
    active: 'province',
    link: '/provinces'
  },
  {
    text: 'Location',
    icon: 'place',
    active: 'location',
    link: '/locations'
  },
  {
    text: 'Location Distance',
    icon: 'sync_alt',
    active: 'location-distance  ',
    link: '/location-distance'
  }
];
export default defineComponent({
  setup() {
    const leftDrawerOpen = ref(false);
    const rightDrawerOpen = ref(false);
    return {
      leftDrawerOpen,
      rightDrawerOpen,
      menuRight
    };
  }
});
</script>

<style scoped lang="sass">
.my-menu-link
  color: white
  background: #1A265A
</style>
<template>
  <q-layout view="hHh LpR fff" class="text-gray-500">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <BaseButton dense flat round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg" />
          </q-avatar>Title
        </q-toolbar-title>

        <BaseButton dense flat round icon="settings" @click="rightDrawerOpen = !rightDrawerOpen" />
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/page1" label="Page One" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>
    </q-header>

    <!-- <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
    </q-drawer>-->

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <q-list bordered padding class="rounded-borders text-primary">
        <q-item
          v-for="item in menuRight"
          :key="item.link"
          clickable
          v-ripple
          :active="$route.meta?.active  === item.active"
          @click="$router.push(item.link)"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" />
          </q-item-section>

          <q-item-section v-text="item.text"></q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item
          clickable
          v-ripple
          :active="$route.meta?.link === 'gusdide'"
          @click="link = 'settings'"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>

          <q-item-section>Settings</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="$route.meta?.link === 'guisdde'"
          @click="link = 'help'"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="help" />
          </q-item-section>

          <q-item-section>Help</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
div.q-item:after {
  content: '';
  position: absolute;
  z-index: -1;
  width: 100%;
  /* height: 0%; */
  left: 0;
  bottom: 0;
  background: #e8eaf6;
  transition: all ease 0.3s;
  font-size: 18px;
}
div.q-item:hover:after {
  height: 100%;
}
</style>
