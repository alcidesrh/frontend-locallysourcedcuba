<script lang="ts">
import { defineComponent } from 'vue';
import FormNotification from './notificationForm/FormNotification.vue';
import useNotification from './notificationService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateNotificationMutation,
  listNotificationQuery,
} from 'src/graphql/query/notification.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Notification } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, items, getItem, variablesListQuery } = useNotification();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const {
      mutate: updateNotification,
      onError,
      onDone,
      loading,
    } = useMutation(updateNotificationMutation, () => ({
      update: (cache) => {
        const data: Record<
          string,
          Record<string, Partial<Notification>[]>
        > | null = cache.readQuery({
          query: listNotificationQuery,
          variables: variablesListQuery.value,
        });
        if (data) items.value = data.listNotifications.collection;
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListNotification' });
    });

    const onSubmit = () => {
      if (typeof item.value.days === 'string') {
        item.value.days = parseInt(item.value.days);
      }
      const value = Object.assign({}, item.value) as Partial<Notification>;
      delete value._id;
      delete value.__typename;

      void updateNotification({
        input: {
          ...value,
          services: item.value.services?.map((e) => (e ? e.id : null)),
        },
      });
    };

    return {
      onSubmit,
      item,
      loading,
    };
  },
  components: { FormNotification },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">Edit Notification</div>
    <FormNotification v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
