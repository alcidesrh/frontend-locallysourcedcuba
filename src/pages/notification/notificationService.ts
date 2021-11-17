import { Notification } from 'src/graphql/@types/types.d';
import {
  listNotificationQuery,
  getNotificationQuery,
  getNotificationsQuery,
} from 'src/graphql/query/notification.graphql';
import { error } from 'src/helpers/notification';
import { useQuery, useLazyQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';
import { cloneDeep } from 'lodash-es';

const {
  item,
  items,
  sortBy,
  descending,
  pagination,
  variablesListQuery,
  search,
} = useEntityFactory<Partial<Notification>>();

const notifications = ref<Partial<Notification>[]>([]);

function list() {
  const {
    load: getNotifications,
    loading,
    onError,
    onResult,
  } = useLazyQuery(listNotificationQuery, () => variablesListQuery.value);

  onResult(
    (result: {
      data: {
        listNotifications: {
          collection: Partial<Notification>[];
          paginationInfo: { totalCount: number };
        };
      };
    }) => {
      items.value = result.data.listNotifications.collection;
      pagination.value.rowsNumber =
        result.data.listNotifications.paginationInfo.totalCount;
    }
  );

  onError((e) => {
    error(e);
  });

  return { pagination, loading, search, getNotifications };
}

export function useNotifications(service = 'htc') {
  const {
    load: getNotifications,
    loading,
    onError,
    onResult,
  } = useLazyQuery(
    getNotificationsQuery,
    () => {
      return { services_code: service };
    },
    {
      fetchPolicy: 'network-only',
    }
  );

  onResult((result: { data: { notifications: Partial<Notification>[] } }) => {
    notifications.value = cloneDeep(result.data.notifications);
  });

  onError((e) => {
    error(e);
  });

  return { notifications, loading, getNotifications };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getNotificationQuery, () => ({
    id: `/api/notifications/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { notification: Partial<Notification> } }) => {
    item.value = Object.assign({}, result.data.notification);
  });
}

export default function useNotification() {
  return { item, items, sortBy, descending, list, getItem, variablesListQuery };
}
