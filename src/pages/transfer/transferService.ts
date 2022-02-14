import { BookingTransfer } from './../../graphql/@types/types.d';
import {
  listBookingTransferQuery,
  bookingTransferIncompleteQuery,
} from 'src/graphql/query/transfer.graphql';
import { error } from 'src/helpers/notification';
import { useLazyQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';
import { cloneDeep } from '@apollo/client/utilities';

const { items, item } = useEntityFactory<Partial<BookingTransfer>>();

const search = ref({
  needle: '',
  from: '',
  to: '',
  notification: [] as number[],
  notificationComplete: null,
  driver: null,
  type: '',
});

function list() {
  const { loading, onError, onResult, load } = useLazyQuery(
    listBookingTransferQuery
  );

  onResult(
    (result: {
      data: { listBookingTransfers: Partial<BookingTransfer>[] };
    }) => {
      items.value = cloneDeep(result.data.listBookingTransfers);
    }
  );

  onError((e) => {
    error(e);
  });

  return {
    loading,
    getTransfer: () => load(listBookingTransferQuery, { ...search.value }),
  };
}

function getIncompleteTransfers() {
  const { loading, onError, onResult, load } = useLazyQuery(
    bookingTransferIncompleteQuery
  );

  onError((e) => {
    error(e);
  });

  return {
    loading,
    onResult,
    getPendingTransfersNotifications: () => {
      load(bookingTransferIncompleteQuery);
    },
  };
}

export default function service() {
  return {
    item,
    items,
    list,
    getIncompleteTransfers,
    search,
  };
}
