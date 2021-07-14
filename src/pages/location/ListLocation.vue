<script lang="ts">
import { Location } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useLocation from './locationService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteLocationMutation,
  listLocationQuery,
} from 'src/graphql/query/location.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';

const columns = [
  {
    required: true,
    label: 'Name',
    align: 'left',
    field: 'name',
    sortable: true,
  },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items, sortBy, variablesListQuery } = useLocation();

    let { pagination, loading, search } = list();

    const locationRowsPerPage: number | null = $q.localStorage.getItem(
      'locationRowsPerPage'
    );
    if (locationRowsPerPage) pagination.value.rowsPerPage = locationRowsPerPage;

    const { mutate: deleteLocation, onError, onDone } = useMutation(
      deleteLocationMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteLocation: {
                location: { id },
              },
            },
          }
        ) => {
          let data: Record<string, Record<string, []>> | null = cache.readQuery(
            {
              query: listLocationQuery,
              variables: variablesListQuery.value,
            }
          );
          if (data) {
            items.value = data.listLocations.collection.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listLocationQuery,
              data: {
                listLocations: {
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
      success({ message: 'The location have been deleted.' });
    });

    return {
      items,
      columns,
      loading,
      pagination,
      router,
      deleteLocation,
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
          $q.localStorage.set('locationRowsPerPage', rowsPerPage);
        }

        pagination.value.page =
          pagination.value.rowsPerPage != rowsPerPage ? 1 : pageTable;
        pagination.value.rowsPerPage = rowsPerPage == 0 ? 100000 : rowsPerPage;
        pagination.value.sortBy = sortByTable;
        pagination.value.descending = descendingTable;
      },
      edit(data: Location) {
        const { item } = useLocation();
        item.value = Object.assign({}, data);
        void router.push({ name: 'EditLocation', params: { id: data._id } });
      },
      remove(data: Location) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this location?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteLocation({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="Locations"
      :rows="items"
      :columns="columns"
      color="primary"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
      createRoute="CreateLocation"
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
