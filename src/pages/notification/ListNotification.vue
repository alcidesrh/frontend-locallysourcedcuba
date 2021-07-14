<script lang="ts">
import { Notification } from 'src/graphql/@types/types';
import { defineComponent, computed } from 'vue';
import useNotification from './notificationService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteNotificationMutation,
  listNotificationQuery,
  priorityNotificationMutation,
} from 'src/graphql/query/notification.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    sortable: true,
    field: 'name',
  },
  {
    name: 'notification_icon',
    align: 'left',
    label: 'Icon',
    field: 'icon',
  },
  { name: 'days', label: 'Days', field: 'days', align: 'left' },
  { name: 'services', label: 'Services', field: 'services', align: 'left' },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items, sortBy, variablesListQuery } = useNotification();

    let { pagination, loading: loadingList, search, getNotifications } = list();

    getNotifications();

    const notificationRowsPerPage: number | null = $q.localStorage.getItem(
      'notificationRowsPerPage'
    );
    if (notificationRowsPerPage)
      pagination.value.rowsPerPage = notificationRowsPerPage;

    const {
      mutate: deleteNotification,
      onError,
      onDone,
      loading: loadingDelete,
    } = useMutation(deleteNotificationMutation, () => ({
      update: (
        cache,
        {
          data: {
            deleteNotification: {
              notification: { id },
            },
          },
        }
      ) => {
        let data: Record<string, Record<string, []>> | null = cache.readQuery({
          query: listNotificationQuery,
          variables: variablesListQuery.value,
        });
        if (data) {
          items.value = data.listNotifications.collection.filter(
            (i: { id: string }) => i.id != id
          );

          cache.writeQuery({
            query: listNotificationQuery,
            data: {
              listNotifications: {
                collection: items.value,
              },
            },
            variables: variablesListQuery.value,
          });
        }
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    onDone(() => {
      success({ message: 'The notification have been deleted.' });
    });

    const {
      mutate: priorityNotification,
      onDone: onDonePriorityMutation,
      loading: loadingPriority,
    } = useMutation(priorityNotificationMutation);

    onDonePriorityMutation(() => {
      getNotifications(undefined, undefined, {
        fetchPolicy: 'network-only',
      });
    });

    const loading = computed(
      () => loadingList.value || loadingDelete.value || loadingPriority.value
    );

    return {
      items,
      columns,
      loading,
      pagination,
      router,
      deleteNotification,
      search,
      onRequest(props: Record<string, unknown>) {
        const {
          page: pageTable,
          rowsPerPage,
          sortBy: sortByTable,
          descending: descendingTable,
        } = props.pagination as {
          sortBy: string;
          descending: boolean;
          page: number;
          rowsPerPage: number;
          rowsNumber: number;
        };

        if (pagination.value.descending != descendingTable) {
          if (!descendingTable) {
            if (!sortBy.value) sortBy.value = [{ name: 'ASC' }];
          } else if (sortBy.value && sortBy.value[0].name == 'ASC') {
            sortBy.value = [{ name: 'DESC' }];
          }
        } else if (
          pagination.value.page == pageTable &&
          (pagination.value.descending == descendingTable) == true &&
          rowsPerPage == pagination.value.rowsPerPage
        )
          sortBy.value = [{ priority: 'ASC' }];

        if (rowsPerPage != pagination.value.rowsPerPage) {
          $q.localStorage.set('notificationRowsPerPage', rowsPerPage);
        }

        pagination.value.page =
          pagination.value.rowsPerPage != rowsPerPage ? 1 : pageTable;
        pagination.value.rowsPerPage = rowsPerPage == 0 ? 100000 : rowsPerPage;
        pagination.value.sortBy = sortByTable;
        pagination.value.descending = descendingTable;
      },
      edit(data: Notification) {
        const { item } = useNotification();
        item.value = Object.assign({}, data);
        void router.push({
          name: 'EditNotification',
          params: { id: data._id },
        });
      },
      remove(data: Notification) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this notification?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteNotification({ input: { id: data.id } });
        });
      },
      priority(id: string, down = false) {
        if (loading.value) return;
        void priorityNotification({ input: { id: id, up: !down } });
      },
    };
  },
});
</script>

<template>
  <q-page>
    <BaseTable
      title="Notifications"
      :rows="items"
      :columns="columns"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
      createRoute="CreateNotification"
      v-model:search="search"
    >
      <template v-slot:body-cell-notification_icon="props">
        <q-td key="notification_icon" :props="props">
          <q-icon
            class="tw-text-lg notification-icon-color"
            v-if="props.row.icon"
            :name="props.row.icon"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-services="props">
        <q-td key="services" :props="props">
          <label
            v-for="(service,index) in props.row.services"
            :key="service.id"
            v-text="`${service.name}${index < props.row.services.length - 1 ? ', ':  ''}`"
          ></label>
        </q-td>
      </template>
      <template v-slot:body-cell-icon="props">
        <q-td key="icon" :props="props">
          <q-icon
            class="q-mr-sm"
            name="arrow_upward"
            :color="loading ||pagination.sortBy || (props.rowIndex == 0 && pagination.page == 1) ? 'grey' : 'orange'"
            style="font-size: 20px; cursor: pointer;"
            @click="() => (loading || pagination.sortBy || (props.rowIndex == 0 && pagination.page == 1)) || priority(props.row.id)"
          />
          <q-icon
            class="q-mr-sm"
            name="arrow_downward"
            :color="loading ||pagination.sortBy || (props.rowIndex == pagination.rowsNumber - 1) ? 'grey' : 'orange'"
            style="font-size: 20px; cursor: pointer;"
            @click="() => (loading || pagination.sortBy || (props.rowIndex == pagination.rowsNumber - 1)) || priority(props.row.id, true)"
          />
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
