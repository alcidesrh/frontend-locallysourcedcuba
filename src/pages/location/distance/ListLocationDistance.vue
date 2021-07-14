<script lang="ts">
import { LocationDistance } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useLocationDistance from './locationDistanceService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteLocationDistanceMutation,
  listLocationDistanceQuery,
} from 'src/graphql/query/location.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';

const columns = [
  {
    name: 'from',
    label: 'From',
    align: 'left',
    field: (item: LocationDistance) => `${item.location1.name}`,
  },
  {
    name: 'to',
    label: 'To',
    align: 'left',
    field: (item: LocationDistance) => `${item.location2.name}`,
  },

  {
    name: 'distance',
    label: 'Distance ( km )',
    field: 'kms',
    align: 'left',
  },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items, sortBy, variablesListQuery } = useLocationDistance();

    let { pagination, loading, search } = list();

    const locationDistanceRowsPerPage: number | null = $q.localStorage.getItem(
      'locationDistanceRowsPerPage'
    );
    if (locationDistanceRowsPerPage)
      pagination.value.rowsPerPage = locationDistanceRowsPerPage;

    const { mutate: deleteLocationDistance, onError, onDone } = useMutation(
      deleteLocationDistanceMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteLocationDistance: {
                locationDistance: { id },
              },
            },
          }
        ) => {
          let data: Record<string, Record<string, []>> | null = cache.readQuery(
            {
              query: listLocationDistanceQuery,
              variables: variablesListQuery.value,
            }
          );
          if (data) {
            items.value = data.listLocationDistances.collection.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listLocationDistanceQuery,
              data: {
                listLocationDistances: {
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
      success({ message: 'The locationDistance have been deleted.' });
    });

    return {
      items,
      columns,
      loading,
      pagination,
      router,
      deleteLocationDistance,
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
          $q.localStorage.set('locationDistanceRowsPerPage', rowsPerPage);
        }

        pagination.value.page =
          pagination.value.rowsPerPage != rowsPerPage ? 1 : pageTable;
        pagination.value.rowsPerPage = rowsPerPage == 0 ? 100000 : rowsPerPage;
        pagination.value.sortBy = sortByTable;
        pagination.value.descending = descendingTable;
      },
      edit(data: LocationDistance) {
        const { item } = useLocationDistance();
        item.value = Object.assign({}, data);
        void router.push({
          name: 'EditLocationDistance',
          params: { id: data._id },
        });
      },
      remove(data: LocationDistance) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this locationDistance?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteLocationDistance({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="Location Distances"
      :rows="items"
      :columns="columns"
      color="primary"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
      createRoute="CreateLocationDistance"
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
