<script lang="ts">
import { defineComponent } from 'vue';
import FormNotification from './notificationForm/FormNotification.vue';
import useNotification from './notificationService';
import { useMutation } from '@vue/apollo-composable';
import {
  createNotificationMutation,
  listNotificationQuery,
} from 'src/graphql/query/notification.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Notification } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, variablesListQuery } = useNotification();

    item.value = {};

    const {
      mutate: createNotification,
      loading,
      onError,
      onDone,
    } = useMutation(createNotificationMutation, () => ({
      update: (
        cache,
        {
          data: {
            createNotification: { notification },
          },
        }
      ) => {
        const value: unknown = { ...notification, ...item.value };

        const data: {
          listNotifications: {
            collection: Partial<Notification>[];
            paginationInfo: Record<string, unknown>;
          };
        } | null = cache.readQuery({
          query: listNotificationQuery,
          variables: variablesListQuery.value,
        });
        cache.writeQuery({
          query: listNotificationQuery,
          data: {
            listNotifications: {
              collection: [
                ...(data?.listNotifications.collection || []),
                value,
              ],
            },
          },
          variables: variablesListQuery.value,
        });
      },
    }));

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListNotification' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      if (typeof item.value.days === 'string') {
        item.value.days = parseInt(item.value.days);
      }
      void createNotification({
        input: {
          ...item.value,
          services: item.value.services?.map((e) => (e ? e.id : null)),
        },
      });
    };

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListNotification' });
      },
      onSubmit,
    };
  },
  components: { FormNotification },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">New Notification</div>
    <FormNotification @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
