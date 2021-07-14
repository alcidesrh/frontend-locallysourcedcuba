<script lang="ts">
import { Destination } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useDestination from './destinationService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteDestinationMutation,
  listDestinationQuery,
} from 'src/graphql/query/destination.graphql';
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
    name: 'province',
    required: true,
    label: 'Province',
    align: 'left',
    field: (destination: Destination) => destination.province.name,
  },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items, sortBy, variablesListQuery } = useDestination();

    let { pagination, loading, search } = list();

    const destinationRowsPerPage: number | null = $q.localStorage.getItem(
      'destinationRowsPerPage'
    );
    if (destinationRowsPerPage)
      pagination.value.rowsPerPage = destinationRowsPerPage;

    const { mutate: deleteDestination, onError, onDone } = useMutation(
      deleteDestinationMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteDestination: {
                destination: { id },
              },
            },
          }
        ) => {
          let data: Record<string, Record<string, []>> | null = cache.readQuery(
            {
              query: listDestinationQuery,
              variables: variablesListQuery.value,
            }
          );
          if (data) {
            items.value = data.listDestinations.collection.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listDestinationQuery,
              data: {
                listDestinations: {
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
      success({ message: 'The destination have been deleted.' });
    });

    return {
      items,
      columns,
      loading,
      pagination,
      router,
      deleteDestination,
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
          $q.localStorage.set('destinationRowsPerPage', rowsPerPage);
        }

        pagination.value.page =
          pagination.value.rowsPerPage != rowsPerPage ? 1 : pageTable;
        pagination.value.rowsPerPage = rowsPerPage == 0 ? 100000 : rowsPerPage;
        pagination.value.sortBy = sortByTable;
        pagination.value.descending = descendingTable;
      },
      edit(data: Destination) {
        const { item } = useDestination();
        item.value = Object.assign({}, data);
        void router.push({ name: 'EditDestination', params: { id: data._id } });
      },
      remove(data: Destination) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this destination?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteDestination({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="Destinations"
      :rows="items"
      :columns="columns"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
      createRoute="CreateDestination"
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
