import { Activity } from 'src/graphql/@types/types.d';
import {
  listActivityQuery,
  getActivityQuery,
} from 'src/graphql/query/activity.graphql';
import { error } from 'src/helpers/notification';
import { useQuery, useLazyQuery } from '@vue/apollo-composable';
import useEntityFactory from 'src/composables/useEntityFactory';
import { cloneDeep } from 'lodash-es';
import { ref, watch } from 'vue';

const { item, items, sortBy, descending, variablesListQuery, search } =
  useEntityFactory<Partial<Activity>>();

const activitiesNormal = ref<Partial<Activity>[]>([]);

const activitiesTransport = ref<Partial<Activity>[]>([]);

const activitiesCombo = ref<Partial<Activity>[]>([]);

const activitiesSelectCombo = ref<string[]>([]);

watch(items, () => {
  activitiesNormal.value = items.value.filter(
    (i) => i.type && i.type == 'normal'
  );
  activitiesTransport.value = items.value.filter(
    (i) => i.type && i.type == 'transport'
  );
  activitiesCombo.value = items.value.filter(
    (i) => i.type && i.type == 'combo'
  );
});

function list() {
  const {
    loading,
    onError,
    onResult,
    load: getActivities,
  } = useLazyQuery(listActivityQuery, () => variablesListQuery.value);

  onResult(
    (result: {
      data: {
        listActivities: Partial<Activity>[];
      };
    }) => {
      items.value = result.data.listActivities;
    }
  );

  onError((e) => {
    error(e);
  });

  return { loading, search, getActivities };
}

function getItem(id: string) {
  const { onError, onResult } = useQuery(getActivityQuery, () => ({
    id: `/api/activities/${id}`,
  }));
  onError((e: Error) => {
    error(e);
  });

  onResult((result: { data: { activity: Activity } }) => {
    item.value = cloneDeep(result.data.activity);
  });
}

export default function useActivity() {
  return {
    item,
    items,
    sortBy,
    descending,
    list,
    getItem,
    variablesListQuery,
    activitiesNormal,
    activitiesTransport,
    activitiesCombo,
    activitiesSelectCombo,
  };
}
