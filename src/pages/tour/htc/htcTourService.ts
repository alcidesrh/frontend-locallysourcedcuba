import { cloneDeep } from 'lodash-es';
import { Tour, TourTemplate } from 'src/graphql/@types/types.d';
import { listTourQuery, getTourQuery } from 'src/graphql/query/tour.graphql';
import { error } from 'src/helpers/notification';
import { useQuery, useLazyQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';
import gql from 'graphql-tag';

const { items, item } = useEntityFactory<Partial<Tour>>();

const search = ref({
  service: 'htc',
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
  } = useLazyQuery(listTourQuery);

  onResult((result: { data: { listTours: Partial<Tour>[] } }) => {
    items.value = cloneDeep(result.data.listTours);
  });

  onError((e) => {
    error(e);
  });

  return {
    loading,
    loadTours,
    getTours: () => loadTours(listTourQuery, { ...search.value }),
  };
}

function getItem(id: string) {
  const { onError, onResult, loading } = useQuery(
    getTourQuery,
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

function getTemplates(tourType = 'htc') {
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
