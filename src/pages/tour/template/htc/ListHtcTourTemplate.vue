<script lang="ts">
import { TourTemplate } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useTourTemplate from './htcTourTemplateService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteTourTemplateMutation,
  listHtcTourTemplateQuery,
} from 'src/graphql/query/tourTemplate.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';

const columns = [
  {
    name: 'color',
    align: 'left',
  },
  {
    label: 'Name',
    field: 'name',
    name: 'name',
    align: 'left',
  },
  {
    label: 'Type',
    field: 'type',
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
    name: 'startPlace',
    align: 'left',
  },
  {
    label: 'End place',
    name: 'finishPlace',
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
          query: listHtcTourTemplateQuery,
        });
        if (data) {
          items.value = data.tourTemplates.filter(
            (i: { id: string }) => i.id != id
          );

          cache.writeQuery({
            query: listHtcTourTemplateQuery,
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
        void router.push({
          name: 'EditHtcTourTemplate',
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
      title="HTC Tour Templates"
      :columns="columns"
      :rows="items"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-pagination
      createRoute="CreateHtcTourTemplate"
    >
      <template v-slot:body-cell-color="props">
        <q-td key="color" :props="props" auto-width>
          <div
            class="tw-w-12"
            style="height: 33px"
            :style="{ backgroundColor: props.row.color }"
          ></div>
        </q-td>
      </template>
      <template v-slot:body-cell-name="props">
        <q-td key="name">
          <div class="tw-max-w-sm tw-whitespace-pre">{{ props.row.name }}</div>
        </q-td>
      </template>
      <template v-slot:body-cell-startPlace="props">
        <q-td key="startPlace">
          <div class="tw-max-w-sm tw-whitespace-pre">
            {{ props.row.startPlace }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-finishPlace="props">
        <q-td key="finishPlace">
          <div class="tw-max-w-sm tw-whitespace-pre">
            {{ props.row.finishPlace }}
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-activities="props">
        <q-td key="activities">
          <div class="tw-max-h-40 tw-overflow-y-auto">
            <div
              class="tw-float-left"
              v-for="activity in props.row.activities"
              :key="activity.id"
            >
              <q-chip v-text="activity.name"></q-chip>
            </div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-notifications="props">
        <q-td key="notifications">
          <div class="tw-flex tw-gap-2">
            <q-icon
              v-for="notification in props.row.notifications"
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
            style="font-size: 20px; cursor: pointer"
            @click="edit(props.row)"
          />
          <q-icon
            name="delete"
            color="negative"
            style="font-size: 20px; cursor: pointer"
            @click="remove(props.row)"
          />
        </q-td>
      </template>
    </BaseTable>
  </q-page>
</template>
