import { Service } from 'src/graphql/@types/types.d';
import {
  listServiceQuery,
  getServiceQuery,
  getServiceInUseQuery,
} from 'src/graphql/query/service.graphql';
import { error } from 'src/helpers/notification';
import { useQuery, useLazyQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { ref } from 'vue';
import gql from 'graphql-tag';

const { items, item } = useEntityFactory<Partial<Service>>();

const service = ref<Partial<Service>>({});

function list() {
  const { loading, onError, onResult } = useQuery(listServiceQuery);

  onResult((result: { data: { services: Partial<Service>[] } }) => {
    items.value = result.data.services;
  });

  onError((e) => {
    error(e);
  });

  return { loading };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getServiceQuery, () => ({
    id: `/api/services/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { service: Partial<Service> } }) => {
    item.value = Object.assign({}, result.data.service);
  });
}

function setServiceInUse() {
  const { onError, onResult, load, loading } =
    useLazyQuery(getServiceInUseQuery);
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { services: Partial<Service>[] } }) => {
    service.value = Object.assign({}, result.data.services[0]);
  });

  return {
    loading,
    getService: (code: string) => load(getServiceInUseQuery, { code: code }),
  };
}

export default function useService() {
  return { item, items, list, getItem, setServiceInUse, service };
}
