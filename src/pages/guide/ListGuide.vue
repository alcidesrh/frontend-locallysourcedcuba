<script lang="ts">
import { Guide } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useGuide from './guideService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteGuideMutation,
  listGuideQuery,
} from 'src/graphql/query/guide.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';

const columns = [
  {
    name: 'fullName',
    required: true,
    label: 'Name',
    align: 'left',
    field: (item: Guide) => `${item.name} ${item.lastName || ''}`,
    sortable: true,
  },
  {
    name: 'email',
    align: 'left',
    label: 'Email',
    field: 'email',
  },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'bonus', label: 'Bonus', field: 'bonus', align: 'left' },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items, sortBy, variablesListQuery } = useGuide();

    let { pagination, loading, search } = list();

    const guideRowsPerPage: number | null = $q.localStorage.getItem(
      'guideRowsPerPage'
    );
    if (guideRowsPerPage) pagination.value.rowsPerPage = guideRowsPerPage;

    const { mutate: deleteGuide, onError, onDone } = useMutation(
      deleteGuideMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteGuide: {
                guide: { id },
              },
            },
          }
        ) => {
          let data: Record<string, Record<string, []>> | null = cache.readQuery(
            {
              query: listGuideQuery,
              variables: variablesListQuery.value,
            }
          );
          if (data) {
            items.value = data.listGuides.collection.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listGuideQuery,
              data: {
                listGuides: {
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
      success({ message: 'The guide have been deleted.' });
    });

    return {
      items,
      columns,
      loading,
      pagination,
      router,
      deleteGuide,
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
          $q.localStorage.set('guideRowsPerPage', rowsPerPage);
        }

        pagination.value.page =
          pagination.value.rowsPerPage != rowsPerPage ? 1 : pageTable;
        pagination.value.rowsPerPage = rowsPerPage == 0 ? 100000 : rowsPerPage;
        pagination.value.sortBy = sortByTable;
        pagination.value.descending = descendingTable;
      },
      edit(data: Guide) {
        const { item } = useGuide();
        item.value = Object.assign({}, data);
        void router.push({ name: 'EditGuide', params: { id: data._id } });
      },
      remove(data: Guide) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this guide?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteGuide({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="Guides"
      :rows="items"
      :columns="columns"
      color="primary"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
      createRoute="CreateGuide"
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
