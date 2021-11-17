import { Guide } from 'src/graphql/@types/types.d';
import {
  listGuideQuery,
  getGuideQuery,
  getGuidesQuery,
} from 'src/graphql/query/guide.graphql';
import { error } from 'src/helpers/notification';
import { useQuery } from '@vue/apollo-composable';
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
} = useEntityFactory<Partial<Guide>>();

const guides = ref<Partial<Guide>[]>([]);

function getGuides() {
  const { onError, onResult } = useQuery(getGuidesQuery);

  onResult(
    (result: {
      data: {
        guides: Partial<Guide>[];
      };
    }) => {
      guides.value = result.data.guides;
    }
  );

  onError((e) => {
    error(e);
  });
}

function list() {
  const { loading, onError, onResult } = useQuery(
    listGuideQuery,
    () => variablesListQuery.value
  );

  onResult(
    (result: {
      data: {
        listGuides: {
          collection: Partial<Guide>[];
          paginationInfo: { totalCount: number };
        };
      };
    }) => {
      items.value = result.data.listGuides.collection;
      pagination.value.rowsNumber =
        result.data.listGuides.paginationInfo.totalCount;
    }
  );

  onError((e) => {
    error(e);
  });

  return { pagination, loading, search };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getGuideQuery, () => ({
    id: `/api/guides/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { guide: Guide } }) => {
    item.value = Object.assign({}, result.data.guide);
  });
}

export default function useGuide() {
  return {
    item,
    items,
    guides,
    sortBy,
    descending,
    list,
    getItem,
    getGuides,
    variablesListQuery,
  };
}
