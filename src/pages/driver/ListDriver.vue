<script lang="ts">
import { Driver } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useDriver from './driverService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteDriverMutation,
  listDriverQuery,
} from 'src/graphql/query/driver.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';

const columns = [
  {
    name: 'name',
    required: true,
    label: 'Name',
    align: 'left',
    field: (row: Record<string, unknown>) => row.name,
    format: (val: string) => `${val}`,
    sortable: true,
  },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'pax', label: 'Pax. #', field: 'pax', align: 'left' },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items, sortBy, variablesListQuery } = useDriver();

    let { pagination, loading, search } = list();

    const driverRowsPerPage: number | null = $q.localStorage.getItem(
      'driverRowsPerPage'
    );
    if (driverRowsPerPage) pagination.value.rowsPerPage = driverRowsPerPage;

    const { mutate: deleteDriver, onError, onDone } = useMutation(
      deleteDriverMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteDriver: {
                driver: { id },
              },
            },
          }
        ) => {
          let data: Record<string, Record<string, []>> | null = cache.readQuery(
            {
              query: listDriverQuery,
              variables: variablesListQuery.value,
            }
          );
          if (data) {
            items.value = data.listDrivers.collection.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listDriverQuery,
              data: {
                listDrivers: {
                  collection: items.value,
                },
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
      success({ message: 'The driver have been deleted.' });
    });

    return {
      items,
      columns,
      loading,
      pagination,
      router,
      deleteDriver,
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
          sortBy.value = null;

        if (rowsPerPage != pagination.value.rowsPerPage) {
          $q.localStorage.set('driverRowsPerPage', rowsPerPage);
        }

        pagination.value.page =
          pagination.value.rowsPerPage != rowsPerPage ? 1 : pageTable;
        pagination.value.rowsPerPage = rowsPerPage == 0 ? 100000 : rowsPerPage;
        pagination.value.sortBy = sortByTable;
        pagination.value.descending = descendingTable;
      },
      edit(data: Driver) {
        const { item } = useDriver();
        item.value = Object.assign({}, data);
        void router.push({ name: 'EditDriver', params: { id: data._id } });
      },
      remove(data: Driver) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this driver?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteDriver({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="Drivers"
      :rows="items"
      :columns="columns"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
      createRoute="CreateDriver"
      v-model:search="search"
    >
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
