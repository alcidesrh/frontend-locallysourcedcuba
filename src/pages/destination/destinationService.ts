import { Destination } from 'src/graphql/@types/types.d';
import {
  listDestinationQuery,
  getDestinationQuery,
  destinationsQuery,
} from 'src/graphql/query/destination.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { LocalStorage } from 'quasar';
import { ref } from 'vue';
import { DocumentNode } from 'node_modules/graphql/index.d';

const {
  item,
  items,
  sortBy,
  descending,
  pagination,
  search,
  variablesListQuery,
} = useEntityFactory<Partial<Destination>>();

const destinationRowsPerPage: number | null = LocalStorage.getItem(
  'destinationRowsPerPage'
);
if (destinationRowsPerPage)
  pagination.value.rowsPerPage = destinationRowsPerPage;

function list() {
  const { loading, onError, onResult } = useQuery(
    listDestinationQuery,
    () => variablesListQuery.value
  );

  onResult(
    (result: {
      data: {
        listDestinations: {
          collection: Partial<Destination>[];
          paginationInfo: { totalCount: number };
        };
      };
    }) => {
      items.value = result.data.listDestinations.collection;
      pagination.value.rowsNumber =
        result.data.listDestinations.paginationInfo.totalCount;
    }
  );

  onError((e) => {
    error(e);
  });

  return { pagination, loading, search };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getDestinationQuery, () => ({
    id: `/api/destinations/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { destination: Destination } }) => {
    item.value = Object.assign({}, result.data.destination);
  });
}

const destinations = ref<Partial<Destination>[]>([]);

function destinationsList(query: DocumentNode | null = null) {
  const { loading, onError, onResult } = useQuery(query || destinationsQuery);

  onResult(
    (result: {
      data: {
        destinations: Partial<Destination>[];
      };
    }) => {
      destinations.value = result.data.destinations;
    }
  );

  onError((e) => {
    error(e);
  });

  return { loading };
}

export default function useDestination() {
  return {
    item,
    items,
    sortBy,
    descending,
    list,
    getItem,
    variablesListQuery,
    destinationsList,
    destinations,
  };
}
