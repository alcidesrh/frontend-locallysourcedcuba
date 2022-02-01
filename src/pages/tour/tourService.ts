import { NotificationTour } from './../../graphql/@types/types.d';
import { useLazyQuery } from '@vue/apollo-composable';
import { ref } from 'vue';
import { NotificationTourIncompleteQuery } from 'src/graphql/query/notification.graphql';
import useService from 'src/pages/service/serviceService';

const { service } = useService();

const pendingNotifications = ref<Partial<NotificationTour>[]>([]);

function getNotificationsTour() {
  const { loading, onResult, load } = useLazyQuery(
    NotificationTourIncompleteQuery
  );

  return {
    loading,
    onResult,
    getPendingNotifications: () => {
      load(NotificationTourIncompleteQuery, {
        service: service.value.code,
      });
    },
  };
}

export default function tourService() {
  return { getNotificationsTour, pendingNotifications };
}
