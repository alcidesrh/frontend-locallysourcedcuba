import { LocationDistance } from 'src/graphql/@types/types.d';
import {
  listLocationDistanceQuery,
  getLocationDistanceQuery,
} from 'src/graphql/query/location.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';

const {
  item,
  items,
  sortBy,
  descending,
  pagination,
  variablesListQuery,
  search,
} = useEntityFactory<Partial<LocationDistance>>();

function list() {
  const { loading, onError, onResult } = useQuery(
    listLocationDistanceQuery,
    () => variablesListQuery.value
  );

  onResult(
    (result: {
      data: {
        listLocationDistances: {
          collection: Partial<LocationDistance>[];
          paginationInfo: { totalCount: number };
        };
      };
    }) => {
      items.value = result.data.listLocationDistances.collection;
      pagination.value.rowsNumber =
        result.data.listLocationDistances.paginationInfo.totalCount;
    }
  );

  onError((e) => {
    error(e);
  });

  return { pagination, loading, search };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getLocationDistanceQuery, () => ({
    id: `/api/location_distances/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { locationDistance: LocationDistance } }) => {
    item.value = Object.assign({}, result.data.locationDistance);
  });
}

export default function useLocationDistance() {
  return { item, items, sortBy, descending, list, getItem, variablesListQuery };
}
