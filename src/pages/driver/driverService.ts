import { Driver } from 'src/graphql/@types/types.d';
import {
  listDriverQuery,
  getDriverQuery,
  getDriversQuery,
} from 'src/graphql/query/driver.graphql';
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
} = useEntityFactory<Partial<Driver>>();

const drivers = ref<Partial<Driver>[]>([]);

function list() {
  const { loading, onError, onResult } = useQuery(
    listDriverQuery,
    () => variablesListQuery.value
  );

  onResult(
    (result: {
      data: {
        listDrivers: {
          collection: Partial<Driver>[];
          paginationInfo: { totalCount: number };
        };
      };
    }) => {
      items.value = result.data.listDrivers.collection;
      pagination.value.rowsNumber =
        result.data.listDrivers.paginationInfo.totalCount;
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
    load: getDrivers,
  } = useLazyQuery(getDriversQuery);

  onResult(
    (result: {
      data: {
        drivers: Partial<Driver>[];
      };
    }) => {
      drivers.value = result.data.drivers;
    }
  );

  onError((e) => {
    error(e);
  });

  return { getDrivers, loading };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getDriverQuery, () => ({
    id: `/api/drivers/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { driver: Driver } }) => {
    item.value = Object.assign({}, result.data.driver);
  });
}

export default function useDriver() {
  return {
    item,
    items,
    sortBy,
    descending,
    list,
    getItem,
    variablesListQuery,
    lazyList,
    drivers,
  };
}
