import { House } from 'src/graphql/@types/types.d';
import { listHouseQuery, getHouseQuery } from 'src/graphql/query/house.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { LocalStorage } from 'quasar';

const {
  item,
  items,
  sortBy,
  descending,
  pagination,
  variablesListQuery,
  search,
} = useEntityFactory<Partial<House>>();

const houseFormStep = ref(1);

const houseRowsPerPage: number | null =
  LocalStorage.getItem('houseRowsPerPage');
if (houseRowsPerPage) pagination.value.rowsPerPage = houseRowsPerPage;

function list() {
  const { loading, onError, onResult } = useQuery(
    listHouseQuery,
    () => variablesListQuery.value
  );
  onResult(
    (result: {
      data: {
        listHouses: {
          collection: Partial<House>[];
          paginationInfo: { totalCount: number };
        };
      };
    }) => {
      items.value = result.data.listHouses.collection;
      pagination.value.rowsNumber =
        result.data.listHouses.paginationInfo.totalCount;
    }
  );

  onError((e) => {
    error(e);
  });

  return { pagination, loading, search };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getHouseQuery, () => ({
    id: `/api/houses/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { house: House } }) => {
    item.value = cloneDeep(result.data.house);
  });
}

export default function useHouse() {
  return {
    item,
    items,
    sortBy,
    descending,
    list,
    getItem,
    variablesListQuery,
    houseFormStep,
  };
}
