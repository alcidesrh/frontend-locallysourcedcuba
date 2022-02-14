import { cloneDeep } from 'lodash-es';
import { Tour, TourTemplate } from 'src/graphql/@types/types.d';
import {
  getLsTourQuery,
  listLsTourQuery,
} from 'src/graphql/query/tour.graphql';
import { error } from 'src/helpers/notification';
import { useQuery, useLazyQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';
import gql from 'graphql-tag';

const { items, item } = useEntityFactory<Partial<Tour>>();

const search = ref({
  service: 'ls',
  needle: '',
  from: '',
  to: '',
  notification: [] as number[],
  notificationComplete: null,
  template: null,
});

const tourFormStep = ref(0);

function list() {
  const {
    loading,
    onError,
    onResult,
    load: loadTours,
  } = useLazyQuery(listLsTourQuery);

  onResult((result: { data: { listLsTours: Partial<Tour>[] } }) => {
    items.value = cloneDeep(result.data.listLsTours);
  });

  onError((e) => {
    error(e);
  });

  return {
    loading,
    loadTours,
    getTours: () => loadTours(listLsTourQuery, { ...search.value }),
  };
}

function getItem(id: string) {
  const { onError, onResult, loading } = useQuery(
    getLsTourQuery,
    () => ({
      id: `/api/tours/${id}`,
    }),
    {
      fetchPolicy: 'network-only',
    }
  );
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { tour: Tour } }) => {
    item.value = cloneDeep(result.data.tour);
  });

  return { loading };
}

const templates = ref<Partial<TourTemplate>[]>([]);

function getTemplates(tourType = 'ls') {
  const {
    loading,
    onError: templatesOnError,
    onResult: teampltesOnResult,
  } = useQuery(
    gql`
      query getTemplates($tourType: String) {
        tourTemplates(tourType: $tourType) {
          id
          _id
          color
          name
          type
        }
      }
    `,
    () => ({
      tourType: tourType,
    }),
    {
      fetchPolicy: 'network-only',
    }
  );

  teampltesOnResult(
    (result: { data: { tourTemplates: Partial<TourTemplate>[] } }) => {
      templates.value = result.data.tourTemplates;
    }
  );

  templatesOnError((e) => {
    error(e);
  });

  return { loading };
}

export default function service() {
  return {
    item,
    items,
    list,
    getItem,
    tourFormStep,
    templates,
    getTemplates,
    search,
  };
}
