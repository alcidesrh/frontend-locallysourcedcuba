<script lang="ts">
import { defineComponent, computed, ref, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';
import {
  createNotificationTourTemplateMutation,
  updateNotificationTourTemplateMutation,
  deleteNotificationTourTemplateMutation,
} from 'src/graphql/query/notification.graphql';
import {
  getTourTemplateQuery,
  listHtcTourTemplateQuery,
} from 'src/graphql/query/tourTemplate.graphql';
import { useNotifications } from 'src/pages/notification/notificationService';
import notificationType from 'src/pages/tour/template/components/notificationTypeService';
import {
  NotificationTourTemplate,
  Notification,
  TourTemplate,
} from 'src/graphql/@types/types';
import { cloneDeep, pick, remove } from 'lodash-es';
import { apolloClient } from 'src/boot/apollo';
import { Ref } from '@vue/reactivity/dist/reactivity';

export default defineComponent({
  setup() {
    const item = inject('item') as Ref<Partial<TourTemplate>>;
    const items = inject('items') as Ref<Partial<TourTemplate>[]>;

    let {
      getNotifications,
      notifications,
      loading: loadingList,
    } = useNotifications(item.value.tourType || undefined);
    if (notificationType.value != item.value.tourType) {
      notificationType.value = item.value.tourType || null;
      getNotifications();
    }

    const itemNotifications: Partial<NotificationTourTemplate>[] = (cloneDeep(
      item.value.notifications
    ) || []) as Partial<NotificationTourTemplate>[];

    const selection = ref<(NotificationTourTemplate | Notification)[]>([]);
    if (itemNotifications?.length)
      selection.value = itemNotifications as NotificationTourTemplate[];

    const {
      mutate: createNotificationTour,
      loading: loadingCreate,
      onError: onErrorCreate,
    } = useMutation(createNotificationTourTemplateMutation, () => ({
      update: (
        cache,
        {
          data: {
            createNotificationTourTemplate: { notificationTourTemplate },
          },
        }
      ) => {
        const data = notificationTourTemplate as NotificationTourTemplate;
        selection.value[
          selection.value.findIndex((e) => e && e.id == data.notification.id)
        ] = data;
        itemNotifications.push(notificationTourTemplate);
      },
    }));
    onErrorCreate((e: Error) => {
      error(e);
    });
    const {
      mutate: updateNotificationTourTemplate,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateNotificationTourTemplateMutation);
    onErrorUpdate((e: Error) => {
      error(e);
    });

    const {
      mutate: deleteNotificationTour,
      loading: loadingDelete,
      onError: onErrorDelete,
    } = useMutation(deleteNotificationTourTemplateMutation, () => ({
      update: (
        cache,
        {
          data: {
            deleteNotificationTourTemplate: {
              notificationTourTemplate: { id },
            },
          },
        }
      ) => {
        remove(itemNotifications, (e) => e && e.id == id);
      },
    }));

    onErrorDelete((e: Error) => {
      error(e);
    });

    return {
      selection,
      notificationsSelect: computed(() =>
        notifications.value.map((e) => {
          return (
            selection.value.filter(
              (e2: Partial<NotificationTourTemplate> | Partial<Notification>) =>
                e2 &&
                e2.__typename == 'NotificationTourTemplate' &&
                e2.notification?.id == e.id
            )[0] || e
          );
        })
      ),
      loading: computed(
        () =>
          loadingList.value ||
          loadingCreate.value ||
          loadingDelete.value ||
          loadingUpdate.value
      ),
      loadingList,
      async onSubmit() {
        const editNotifications = selection.value.filter(
          (e) => e.__typename == 'NotificationTourTemplate'
        );
        for (let notification of editNotifications) {
          await updateNotificationTourTemplate({
            input: pick(notification, ['id', 'days']),
          });
        }

        const newNotifications = selection.value.filter(
          (e) => e.__typename == 'Notification'
        );
        for (let notification of newNotifications) {
          const data = {
            notification: notification.id,
            tourTemplate: item.value.id,
            days: notification.days,
          };

          await createNotificationTour({ input: data });
        }

        const deleteNotifications = itemNotifications.filter(
          (e) => selection.value.filter((e2) => e2.id == e?.id).length == 0
        );

        if (deleteNotifications) {
          for (let notification of deleteNotifications) {
            if (notification)
              await deleteNotificationTour({ input: { id: notification.id } });
          }
        }

        if (item.value._id)
          await apolloClient
            .query({
              query: getTourTemplateQuery,
              variables: {
                id: `/api/tour_templates/${item.value._id}`,
              },
              fetchPolicy: 'network-only',
            })
            .then(
              (response: { data: { tourTemplate: Partial<TourTemplate> } }) => {
                item.value = cloneDeep(response.data.tourTemplate);
              }
            );

        const result: Record<string, []> | null = apolloClient.cache.readQuery({
          query: listHtcTourTemplateQuery,
        });
        if (result) items.value = result.tourTemplates;
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
    </div>
    <div class="row q-col-gutter-md tw-mt-3">
      <div class="col-12 tw-text-center">
        <BaseButton label="Save" type="submit" color="primary" class="q-ml-sm" :loading="loading" />
      </div>
    </div>
  </q-form>
</template>
