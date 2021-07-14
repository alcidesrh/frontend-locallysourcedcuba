import { Location } from 'src/graphql/@types/types.d';
import {
  listLocationQuery,
  getLocationQuery,
  getLocationsQuery,
} from 'src/graphql/query/location.graphql';
import { error } from 'src/helpers/notification';
import { useQuery, useLazyQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';

const {
  item,
  items,
  sortBy,
  descending,
  pagination,
  variablesListQuery,
  search,
} = useEntityFactory<Partial<Location>>();

const locations = ref<Partial<Location>[]>([]);
function list() {
  const { loading, onError, onResult } = useQuery(
    listLocationQuery,
    () => variablesListQuery.value
  );

  onResult(
    (result: {
      data: {
        listLocations: {
          collection: Partial<Location>[];
          paginationInfo: { totalCount: number };
        };
      };
    }) => {
      items.value = result.data.listLocations.collection;
      pagination.value.rowsNumber =
        result.data.listLocations.paginationInfo.totalCount;
    }
  );

  onError((e) => {
    error(e);
  });

  return { pagination, loading, search };
}

function lazyList() {
  const {
    loading,
    onError,
    onResult,
    load: getLocations,
  } = useLazyQuery(getLocationsQuery, () => variablesListQuery.value);

  onResult(
    (result: {
      data: {
        locations: Partial<Location>[];
      };
    }) => {
      locations.value = result.data.locations;
    }
  );

  onError((e) => {
    error(e);
  });

  return { loading, getLocations };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getLocationQuery, () => ({
    id: `/api/locations/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { location: Location } }) => {
    item.value = Object.assign({}, result.data.location);
  });
}

export default function useLocation() {
  return {
    item,
    items,
    sortBy,
    descending,
    list,
    getItem,
    variablesListQuery,
    lazyList,
    locations,
  };
}
