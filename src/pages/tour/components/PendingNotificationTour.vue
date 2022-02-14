<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import tourService from 'src/pages/tour/tourService';
import TourChip from 'src/pages/tour/components/TourChip.vue';
import { useNotifications } from 'src/pages/notification/notificationService';

export default defineComponent({
  components: {
    TourChip,
  },
  props: ['editRoute'],
  setup() {
    const { notifications } = useNotifications();

    const { pendingNotifications } = tourService();

    const menu = computed(() =>
      notifications.value.map((e) => {
        return {
          ...e,
          notificationsPending: pendingNotifications.value.filter(
            (n) => n.notification?.id == e.id
          ),
        };
      })
    );

    const menuStates = ref(
      Array.from({ length: notifications.value.length }, () => false)
    );

    return {
      menu,
      menuStates,
      // setMenuState: (i: number) => { ///Show Menu when over---------
      //   menuStates.value = Array.from(
      //     { length: notifications.value.length },
      //     () => false
      //   );
      //   menuStates.value[i] = true;
      // },
    };
  },
});
</script>

<template >
  <q-btn
    size="md"
    dense
    flat
    v-for="n,i in menu"
    :key="n.id"
    :icon="n.icon"
    :class="{'text-orange-8': n.notificationsPending.length, 'text-teal': !n.notificationsPending.length}"
    class="tw-text-2xl tw-cursor-pointer tw-mx-1"
  >
    <q-badge
      color="indigo"
      floating
      v-if="n.notificationsPending.length"
    >{{n.notificationsPending.length}}</q-badge>
    <q-menu v-model="menuStates[i]" v-if="n.notificationsPending.length">
      <q-list style="min-width: 200px" class="tw-py-3">
        <q-item
          :to="{ name: editRoute, params: { id: nt.tour?._id } }"
          class="tw-px-2"
          clickable
          v-close-popup
          v-for="nt,i in n.notificationsPending"
          :key="i"
          style="min-height: 44px; padding: 4px 12px;"
        >
          <q-item-section
            class="tw-rounded-lg tw-flex tw-justify-center tw-content-center tw-items-center"
          >
            <TourChip :tour="nt.tour" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
