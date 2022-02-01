import { BookingTransfer } from './../../graphql/@types/types.d';
import {
  listBookingTransferQuery,
  bookingTransferIncompleteQuery,
} from 'src/graphql/query/transfer.graphql';
import { error } from 'src/helpers/notification';
import { useLazyQuery, useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';

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
      items.value = result.data.listBookingTransfers;
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
  const { loading, onError, onResult } = useQuery(
    bookingTransferIncompleteQuery
  );

  // onResult(
  //   (result: {
  //     data: { listBookingTransfers: Partial<BookingTransfer>[] };
  //   }) => {
  //     items.value = result.data.listBookingTransfers;
  //   }
  // );

  onError((e) => {
    error(e);
  });

  return {
    loading,
    onResult,
  };
}

// function getItem(id: string) {
//   const { onError, onResult, loading } = useQuery(getTourQuery, () => ({
//     id: `/api/tours/${id}`,
//   }));
//   onError((e: Error) => {
//     error(e);
//   });

//   onResult((result: { data: { tour: BookingTransfer } }) => {
//     item.value = cloneDeep(result.data.tour);
//   });

//   return { loading };
// }

export default function service() {
  return {
    item,
    items,
    list,
    getIncompleteTransfers,
    search,
  };
}
