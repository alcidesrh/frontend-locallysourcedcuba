<script lang="ts">
import { House } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useHouse from './houseService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteHouseMutation,
  listHouseQuery,
} from 'src/graphql/query/house.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';
import { cloneDeep, truncate } from 'lodash-es';
import { format } from 'src/helpers/date';

const columns = [
  {
    name: 'type',
    label: 'Type',
    align: 'left',
    field: (row: House) => row.type?.name,
  },
  { name: 'name', label: 'Name', field: 'name', align: 'left' },
  {
    name: 'destination',
    label: 'Destination',
    align: 'left',
    field: (row: House) => row.destination?.name,
  },
  {
    name: 'address',
    label: 'Address',
    align: 'left',
    field: 'address',
  },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'features', label: 'Features', align: 'left' },
  { name: 'rooms', label: 'Rooms', align: 'left' },
  { name: 'seasons', label: 'Seasons', align: 'left' },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items, sortBy, variablesListQuery } = useHouse();

    let { pagination, loading, search } = list();

    const { mutate: deleteHouse, onError, onDone } = useMutation(
      deleteHouseMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteHouse: {
                house: { id },
              },
            },
          }
        ) => {
          let data: Record<string, Record<string, []>> | null = cache.readQuery(
            {
              query: listHouseQuery,
              variables: variablesListQuery.value,
            }
          );

          if (data) {
            items.value = data.listHouses.collection.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listHouseQuery,
              data: {
                listHouses: {
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
      success({ message: 'The house have been deleted.' });
    });

    return {
      items,
      columns,
      loading,
      pagination,
      router,
      deleteHouse,
      search,
      truncate,
      format,
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
          $q.localStorage.set('houseRowsPerPage', rowsPerPage);
        }

        pagination.value.page =
          pagination.value.rowsPerPage != rowsPerPage ? 1 : pageTable;
        pagination.value.rowsPerPage = rowsPerPage == 0 ? 100000 : rowsPerPage;
        pagination.value.sortBy = sortByTable;
        pagination.value.descending = descendingTable;
      },
      edit(data: House) {
        const { item } = useHouse();
        item.value = cloneDeep(data);
        void router.push({ name: 'EditHouse', params: { id: data._id } });
      },
      remove(data: House) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this house?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteHouse({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <q-table
      title="Houses"
      :rows="items"
      :columns="columns"
      color="primary"
      row-key="name"
      :loading="loading"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template v-slot:top>
        <label class="text-h6">Houses</label>
        <BaseButton
          class="q-ml-md tw-absolute sm:tw-relative tw-top-0 tw-right-0 tw-mt-2 tw-mr-2 sm:tw-mt-0 sm:tw-mr-0"
          round
          color="primary"
          icon="add"
          @click="router.push({name: 'CreateHouse'})"
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
      <template v-slot:body-cell-address="props">
        <q-td key="address" :props="props">
          <div>
            <q-tooltip anchor="top middle" self="top middle">{{props.row.address}}</q-tooltip>
            <label>{{props.row.address && truncate(props.row.address, { length: 20 })}}</label>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-features="props">
        <q-td key="features" :props="props">
          <q-chip
            class="tw-ml-0"
            v-for="feature in props.row.features"
            :key="feature.id"
          >{{feature.name}}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-rooms="props">
        <q-td key="rooms" :props="props">
          <q-chip
            class="tw-ml-0"
            v-for="room in props.row.rooms"
            :key="room.id"
          >{{room.roomType.name}}</q-chip>
        </q-td>
      </template>
      <template v-slot:body-cell-seasons="props">
        <q-td key="seasons" :props="props">
          <q-chip
            class="tw-ml-0"
            v-for="season in props.row.houseSeasons"
            :key="season.id"
          >{{format(season.startDate)}} - {{format(season.endDate)}}</q-chip>
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
