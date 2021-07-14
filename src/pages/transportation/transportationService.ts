import { Transportation } from 'src/graphql/@types/types.d';
import {
  getTransportationsQuery,
  getTransportationQuery,
} from 'src/graphql/query/transportation.graphql';
import { error } from 'src/helpers/notification';
import { useQuery, useLazyQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';
import { cloneDeep } from 'lodash-es';

const { item, items } = useEntityFactory<Partial<Transportation>>();

const transportationFormStep = ref(1);

function list() {
  const {
    loading,
    onError,
    onResult,
    load: getTransportations,
  } = useLazyQuery(getTransportationsQuery, undefined, {
    fetchPolicy: 'network-only',
  });

  onResult(
    (result: {
      data: {
        transportations: Partial<Transportation>[];
      };
    }) => {
      items.value = result.data.transportations;
    }
  );

  onError((e) => {
    error(e);
  });

  return { loading, getTransportations };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getTransportationQuery, () => ({
    id: `/api/transportations/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { transportation: Transportation } }) => {
    item.value = cloneDeep(result.data.transportation);
  });
}

export default function useTransportation() {
  return { item, items, list, getItem, transportationFormStep };
}
