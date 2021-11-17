<script lang="ts">
import { defineComponent, computed, ref, inject, watch } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import {
  createNotificationTourMutation,
  updateNotificationTourMutation,
  deleteNotificationTourMutation,
} from 'src/graphql/query/notification.graphql';
import { useNotifications } from 'src/pages/notification/notificationService';
import notificationType from 'src/pages/tour/components/notificationTypeService';
import {
  NotificationTour,
  Notification,
  Tour,
  Service,
} from 'src/graphql/@types/types';
import { cloneDeep, pick, remove } from 'lodash-es';
import { Ref } from '@vue/reactivity/dist/reactivity';
import globalLoading from 'src/store/loading';

export default defineComponent({
  setup() {
    const item = inject('item') as Ref<Partial<Tour>>;
    const service = inject('service') as Ref<Partial<Service>>;
    let {
      getNotifications,
      notifications,
      loading: loadingList,
    } = useNotifications(service.value.code || undefined);

    const loadingCrud = ref(false);

    const { mutate: createNotificationTour, onError: onErrorCreate } =
      useMutation(createNotificationTourMutation, () => ({
        update: (
          cache,
          {
            data: {
              createNotificationTour: { notificationTour },
            },
          }
        ) => {
          const data = notificationTour as NotificationTour;
          selection.value[
            selection.value.findIndex((e) => e && e.id == data.notification.id)
          ] = data;
          itemNotifications.push(notificationTour);
          item.value.notifications = itemNotifications as NotificationTour[];
        },
      }));
    onErrorCreate((e: Error) => {
      error(e);
      loadingCrud.value = false;
    });

    const { mutate: updateNotificationTour, onError: onErrorUpdate } =
      useMutation(updateNotificationTourMutation, () => ({
        update: (
          cache,
          {
            data: {
              updateNotificationTour: { notificationTour },
            },
          }
        ) => {
          const data = notificationTour as NotificationTour;
          selection.value[
            selection.value.findIndex((e) => e && e.id == data.notification.id)
          ] = data;
          itemNotifications[
            itemNotifications.findIndex((e) => e && e.id == data.id)
          ] = data;
          item.value.notifications = itemNotifications as NotificationTour[];
        },
      }));
    onErrorUpdate((e: Error) => {
      error(e);
      loadingCrud.value = false;
    });

    const { mutate: deleteNotificationTour, onError: onErrorDelete } =
      useMutation(deleteNotificationTourMutation, () => ({
        update: (
          cache,
          {
            data: {
              deleteNotificationTour: {
                notificationTour: { id },
              },
            },
          }
        ) => {
          remove(itemNotifications, (e) => e && e.id == id);
          item.value.notifications = itemNotifications as NotificationTour[];
        },
      }));

    onErrorDelete((e: Error) => {
      error(e);
      loadingCrud.value = false;
    });

    watch(
      [loadingList, loadingCrud],
      ([v, v2]) => (globalLoading.value = v || v2)
    );
    if (
      notifications.value.length == 0 ||
      notificationType.value != service.value.code
    ) {
      notificationType.value = service.value.code || null;
      getNotifications();
    }
    const itemNotifications: Partial<NotificationTour>[] = (cloneDeep(
      item.value.notifications
    ) || []) as Partial<NotificationTour>[];

    const selection = ref<(Partial<NotificationTour> | Notification)[]>([]);
    if (itemNotifications?.length) selection.value = itemNotifications;
    return {
      selection,
      notificationsSelect: computed(() =>
        notifications.value.map((e) => {
          return (
            selection.value.filter(
              (e2: Partial<NotificationTour> | Partial<Notification>) =>
                e2 &&
                e2.__typename == 'NotificationTour' &&
                e2.notification?.id == e.id
            )[0] || e
          );
        })
      ),
      loadingList,
      async onSubmit() {
        loadingCrud.value = true;

        const deleteNotifications = itemNotifications.filter(
          (e) => selection.value.filter((e2) => e2.id == e?.id).length == 0
        );

        if (deleteNotifications) {
          for (let notification of deleteNotifications) {
            if (notification)
              await deleteNotificationTour({ input: { id: notification.id } });
          }
        }

        const editNotifications = selection.value.filter(
          (e) => e.__typename == 'NotificationTour'
        );
        for (let notification of editNotifications) {
          await updateNotificationTour({
            input: pick(notification, ['id', 'days']),
          });
        }

        const newNotifications = selection.value.filter(
          (e) => e.__typename == 'Notification'
        );
        for (let notification of newNotifications) {
          const data = {
            notification: notification.id,
            tour: item.value.id,
            days: notification.days,
          };

          await createNotificationTour({ input: data });
        }
        loadingCrud.value = false;
      },
    };
  },
});
</script>


<template >
  <q-form @submit="onSubmit" class="q-mt-md tw-w-full md:tw-w-3/4 md:tw-mx-auto lg:tw-w-1/2">
    <div v-if="!loadingList">
      <div class="row q-col-gutter-md">
        <div class="col-8 col-md-10"></div>
        <div class="col-4 col-md-2 tw-flex tw-items-center">
          <label>Days</label>
        </div>
      </div>
      <div class="row q-col-gutter-md tw-mt-0" v-for="item in notificationsSelect" :key="item.id">
        <div class="col-8 col-md-9 tw-flex tw-items-center">
          <BaseCheckBox :val="item" v-model="selection">
            <template v-slot>
              <q-icon
                v-if="item.icon"
                :name="item.icon"
                class="tw-text-2xl notification-icon-color"
              ></q-icon>
              <label class="tw-ml-2">{{item.name}}</label>
            </template>
          </BaseCheckBox>
        </div>
        <div class="col-4 col-md-3 tw-flex tw-items-center">
          <BaseInput v-model.number="item.days" type="number"></BaseInput>
        </div>
      </div>
      <div class="row q-col-gutter-md tw-mt-3">
        <div class="col-12 tw-text-center">
          <BaseButton label="Save" type="submit" color="primary" class="q-ml-sm" />
        </div>
      </div>
    </div>
  </q-form>
</template>
