<script lang="ts">
import { Activity } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useActivity from '../activityService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteActivityMutation,
  listActivityQuery,
  priorityActivityComboMutation,
  deleteActivityComboMutation,
} from 'src/graphql/query/activity.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';
import { cloneDeep, truncate } from 'lodash-es';
import { format } from 'src/helpers/date';

const columns = [
  { label: 'Name', field: 'name', align: 'left' },
  {
    label: 'Destination',
    align: 'left',
    field: (row: Activity) => row.destination?.name,
  },
  {
    name: 'activities',
    label: 'Activities',
    align: 'left',
    field: 'activities',
  },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();

    let { list, activitiesCombo: items, variablesListQuery } = useActivity();

    let { loading, search, getActivities } = list();

    getActivities(undefined, undefined, {
      fetchPolicy: 'network-only',
    });

    const { mutate: deleteActivity, onError, onDone } = useMutation(
      deleteActivityMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteActivity: {
                activity: { id },
              },
            },
          }
        ) => {
          let data: Record<string, []> | null = cache.readQuery({
            query: listActivityQuery,
            variables: variablesListQuery.value,
          });
          if (data) {
            items.value = data.listActivities.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listActivityQuery,
              data: {
                listActivities: items.value,
              },
              variables: variablesListQuery.value,
            });
          }
        },
      })
    );

    onError((e: Error) => {
      error(e);
    });

    onDone(() => {
      success({ message: 'The activity have been deleted.' });
    });

    const {
      mutate: priorityActivityCombo,
      onDone: onDonePriorityMutation,
      loading: loadingPriority,
    } = useMutation(priorityActivityComboMutation);

    onDonePriorityMutation(() => {
      getActivities(undefined, undefined, {
        fetchPolicy: 'network-only',
      });
    });

    const {
      mutate: deleteActivityCombo,
      onDone: onDoneDeleteActivityComboMutation,
    } = useMutation(deleteActivityComboMutation);

    onDoneDeleteActivityComboMutation(() => {
      getActivities(undefined, undefined, {
        fetchPolicy: 'network-only',
      });
    });

    return {
      items,
      columns,
      loading,
      router,
      search,
      truncate,
      format,
      loadingPriority,
      edit(data: Activity) {
        const { item } = useActivity();
        item.value = cloneDeep(data);
        void router.push({
          name: 'EditActivityCombo',
          params: { id: data._id },
        });
      },
      remove(data: Activity) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this activity?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteActivity({ input: { id: data.id } });
        });
      },
      priority(id: string, down = false) {
        if (loadingPriority.value) return;
        void priorityActivityCombo({ input: { id: id, up: !down } });
      },
      removeActivityCombo(id: string) {
        void deleteActivityCombo({ input: { id: id } });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <q-table
      title="Activitys"
      :rows="items"
      :columns="columns"
      color="primary"
      row-key="name"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-pagination
    >
      <template v-slot:top>
        <label class="text-h6">Combo Activities</label>
        <BaseButton
          class="q-ml-md tw-absolute sm:tw-relative tw-top-0 tw-right-0 tw-mt-2 tw-mr-2 sm:tw-mt-0 sm:tw-mr-0"
          round
          color="primary"
          icon="add"
          @click="router.push({name: 'CreateActivityCombo'})"
        />
        <q-space />
        <div class="flex justify-end tw-w-full tw-mt-5 sm:tw-mt-0 sm:tw-w-auto">
          <BaseInput label="Search" v-model="search" clearable class="tw-w-full sm:tw-w-auto">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </BaseInput>
        </div>
      </template>
      <template v-slot:body-cell-activities="props">
        <q-td key="activities" :props="props">
          <div class="tw-grid tw-grid-cols-1 tw-gap-4"></div>
          <div v-for="(activity, index) in props.row.activities" :key="activity.id">
            <span v-if="props.row.activities.length > 1">
              <q-icon
              class="q-mr-sm"
              name="arrow_upward"
              :color="loadingPriority || index == 0 ? 'grey' : 'orange'"
              style="font-size: 20px; cursor: pointer;"
              @click="() => loadingPriority || priority(activity.id)"
            />
            <q-icon
              class="q-mr-sm"
              name="arrow_downward"
              :color="loadingPriority || index == props.row.activities.length - 1 ? 'grey' : 'orange'"
              style="font-size: 20px; cursor: pointer;"
              @click="() => loadingPriority || index == props.row.activities.length - 1 || priority(activity.id, true)"
            />
            </span>
            <q-chip removable @remove="removeActivityCombo(activity.id)">{{activity.activity.name}}</q-chip>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-icon="props">
        <q-td key="icon" :props="props">
          <q-icon
            class="q-mr-sm"
            name="edit"
            color="teal"
            style="font-size: 20px; cursor: pointer;"
            @click="edit(props.row)"
          />
          <q-icon
            name="delete"
            color="negative"
            style="font-size: 20px; cursor: pointer;"
            @click="remove(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>
