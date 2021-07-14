import { ref, computed, watch } from 'vue';
import usePagination from './usePagination';

export default function useEntityFactory<Type>() {
  const items = ref<Type[]>([]);

  const item = ref<Type>({} as Type);

  const { page, itemsPerPage, sortBy, descending, total, pagination } =
    usePagination();

  const filter = ref<string>();

  const variablesListQuery = computed(() => {
    return {
      page: pagination.value.page,
      itemsPerPage: pagination.value.rowsPerPage,
      order: sortBy.value || null,
      needle: filter.value || null,
    };
  });

  let timeout: unknown;
  const search = ref('');
  watch(search, (val) => {
    if (!val) {
      filter.value = '';
      return;
    }
    clearTimeout(timeout as number);
    timeout = setTimeout(() => {
      filter.value = search.value;
      if (pagination.value.page != 1) pagination.value.page = 1;
    }, 1000);
  });

  return {
    item,
    items,
    page,
    itemsPerPage,
    sortBy,
    descending,
    total,
    pagination,
    variablesListQuery,
    search,
  };
}
