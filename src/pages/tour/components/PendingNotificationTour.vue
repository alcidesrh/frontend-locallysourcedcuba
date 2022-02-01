<script lang="ts">
import { defineComponent, toRefs, ref } from 'vue';
import { NotificationTour, Notification } from 'src/graphql/@types/types';
export default defineComponent({
  props: ['notifications', 'pendingNotifications', 'editRoute'],
  setup(props) {
    const { notifications } = toRefs(props as Record<string, Notification[]>);

    const { pendingNotifications } = toRefs(
      props as Record<string, NotificationTour[]>
    );

    const menu = notifications.value.map((e) => {
      return {
        ...e,
        notificationsPending: pendingNotifications.value.filter(
          (n) => n.notification.id == e.id
        ),
      };
    });

    const menuStates = ref(
      Array.from({ length: notifications.value.length }, () => false)
    );

    return {
      menu,
      menuStates,
      setMenuState: (i: number) => {
        menuStates.value = Array.from(
          { length: notifications.value.length },
          () => false
        );
        menuStates.value[i] = true;
      },
    };
  },
});
</script>

<template >
  <q-btn
    size="md"
    dense
    flat
    @mouseover="setMenuState(i)"
    v-for="n,i in menu"
    :key="n.id"
    :icon="n.icon"
    :class="{'tw-text-red-500': n.notificationsPending.length, 'tw-text-green-500': !n.notificationsPending.length}"
    class="tw-text-2xl tw-cursor-pointer tw-mx-1"
  >
    <q-badge
      color="orange"
      floating
      v-if="n.notificationsPending.length"
    >{{n.notificationsPending.length}}</q-badge>
    <q-menu v-model="menuStates[i]" v-if="n.notificationsPending.length">
      <q-list style="min-width: 200px" class="tw-py-3">
        <q-item
          :to="{ name: editRoute, params: { id: nt.tour._id } }"
          class="tw-px-2"
          clickable
          v-close-popup
          v-for="nt,i in n.notificationsPending"
          :key="i"
          style="min-height: 44px; padding: 4px 12px;"
        >
          <q-item-section
            class="tw-rounded-lg tw-flex tw-justify-center tw-content-center tw-items-center"
            :style="{backgroundColor: nt.tour.color}"
          >
            <div
              class="tw-bg-gray-700 tw-text-white tw-rounded-lg tw-tracking-widest tw-cursor-pointer tw-absolute"
              style="padding: 0px 10px;"
            >{{nt.tour.code}}</div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
