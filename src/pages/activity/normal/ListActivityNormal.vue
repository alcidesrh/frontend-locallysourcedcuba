<script lang="ts">
import { Activity } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useActivity from '../activityService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteActivityMutation,
  listActivityQuery,
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
    label: 'Cost per Person',
    align: 'left',
    field: 'personCost',
  },
  { label: 'Cost per Guide', field: 'guideCost', align: 'left' },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, activitiesNormal: items, variablesListQuery } = useActivity();

    let { loading, search } = list();

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

    return {
      items,
      columns,
      loading,
      router,
      deleteActivity,
      search,
      truncate,
      format,
      edit(data: Activity) {
        const { item } = useActivity();
        item.value = cloneDeep(data);
        void router.push({
          name: 'EditActivityNormal',
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
        <label class="text-h6">Normal Activities</label>
        <BaseButton
          class="q-ml-md tw-absolute sm:tw-relative tw-top-0 tw-right-0 tw-mt-2 tw-mr-2 sm:tw-mt-0 sm:tw-mr-0"
          round
          color="primary"
          icon="add"
          @click="router.push({name: 'CreateActivityNormal'})"
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
