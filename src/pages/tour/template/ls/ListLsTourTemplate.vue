<script lang="ts">
import { TourTemplate } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useTourTemplate from './lsTourTemplateService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteTourTemplateMutation,
  listLsTourTemplateQuery,
} from 'src/graphql/query/tourTemplate.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';
import { cloneDeep } from 'lodash-es';

const columns = [
  {
    name: 'color',
    align: 'left',
  },
  {
    label: 'Type',
    field: 'type',
    align: 'left',
  },
  {
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    label: 'Code',
    field: 'code',
    align: 'left',
  },
  {
    label: 'Start place',
    field: 'startPlace',
    align: 'left',
  },
  {
    label: 'End place',
    field: 'finishPlace',
    align: 'left',
  },
  {
    name: 'activities',
    label: 'Activities',
    align: 'left',
  },
  ,
  {
    name: 'notifications',
    label: 'Notifications',
    align: 'left',
  },
  { name: 'icon' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items } = useTourTemplate();

    let { loading } = list();

    const {
      mutate: deleteTourTemplate,
      onError,
      onDone,
      loading: loadingDelete,
    } = useMutation(deleteTourTemplateMutation, () => ({
      update: (
        cache,
        {
          data: {
            deleteTourTemplate: {
              tourTemplate: { id },
            },
          },
        }
      ) => {
        let data: Record<string, []> | null = cache.readQuery({
          query: listLsTourTemplateQuery,
        });
        if (data) {
          items.value = data.tourTemplates.filter(
            (i: { id: string }) => i.id != id
          );

          cache.writeQuery({
            query: listLsTourTemplateQuery,
            data: {
              tourTemplates: items.value,
            },
          });
        }
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    onDone(() => {
      success({ message: 'The item have been deleted.' });
    });
    return {
      items,
      columns,
      loading,
      router,
      deleteTourTemplate,
      edit(data: TourTemplate) {
        const { item } = useTourTemplate();
        item.value = cloneDeep(data);
        void router.push({
          name: 'EditLsTourTemplate',
          params: { id: data._id },
        });
      },
      remove(data: TourTemplate) {
        if (loadingDelete.value) return;
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this item?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteTourTemplate({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="LS Tour Templates"
      :columns="columns"
      :rows="items"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-pagination
      createRoute="CreateLsTourTemplate"
    >
      <template v-slot:body-cell-color="props">
        <q-td key="color" :props="props" auto-width>
          <div class="tw-w-12" style="height: 33px;" :style="{backgroundColor: props.row.color}"></div>
        </q-td>
      </template>
      <template v-slot:body-cell-activities="props">
        <q-td key="activities">
          <div>
            <div
              class="tw-float-left"
              v-for="(activity) in props.row.activities"
              :key="activity.id"
            >
              <q-chip v-text="activity.name"></q-chip>
            </div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-notifications="props">
        <q-td key="notifications">
          <div>
            <q-icon
              v-for="(notification) in props.row.notifications"
              :key="notification.id"
              :name="notification.icon"
              class="tw-float-left tw-text-2xl notification-icon-color"
            ></q-icon>
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
    </BaseTable>
  </q-page>
</template>
