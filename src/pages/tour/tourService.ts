import { NotificationTour } from './../../graphql/@types/types.d';
import { useLazyQuery } from '@vue/apollo-composable';
import { ref } from 'vue';
import { NotificationTourIncompleteQuery } from 'src/graphql/query/notification.graphql';
import useService from 'src/pages/service/serviceService';

const { service } = useService();

const pendingNotifications = ref<Partial<NotificationTour>[]>([]);

function getNotificationsTour() {
  const { loading, onResult, refetch, load } = useLazyQuery(
    NotificationTourIncompleteQuery,
    {
      service: service.value.code,
    }
  );

  onResult(
    (result: {
      data: {
        notifications_tour_incompleteNotificationTours: Partial<NotificationTour>[];
      };
    }) => {
      pendingNotifications.value =
        result.data.notifications_tour_incompleteNotificationTours;
    }
  );

  return {
    loading,
    onResult,
    load: () => {
      load(NotificationTourIncompleteQuery, {
        service: service.value.code,
      });
    },
    refetch,
  };
}

export default function tourService() {
  return { getNotificationsTour, pendingNotifications };
}
