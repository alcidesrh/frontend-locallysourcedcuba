<script lang="ts">
import { Transportation } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useTransportation from './transportationService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteTransportationMutation,
  getTransportationsQuery
} from 'src/graphql/query/transportation.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';
import { cloneDeep } from 'lodash-es';

const columns = [
  {
    label: 'Name',
    align: 'left',
    field: 'name',
  },
  {
    label: 'Driver',
    align: 'left',
    field: (item: Transportation) => `${item.driver ? item.driver.name : ''}`,
  },
  {
    name:'prices',
    label: 'Prices',
    align: 'left',
  },
  {
    name:'locations',
    label: 'Locations',
    align: 'left',
  },
  { name: 'icon', label: '', field: '', align: 'right' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items } = useTransportation();

    let { loading, getTransportations } = list();

    getTransportations();

    const { mutate: deleteTransportation, onError, onDone } = useMutation(deleteTransportationMutation, () => ({
        update: ( 
          cache,
          {
            data: {
              deleteTransportation: {
                transportation: { id },
              },
            },
          }
        ) => {
          let data: Record<string, []> | null = cache.readQuery(
            {
              query: getTransportationsQuery,
            }
          );
          if (data) {
            items.value = data.transportations.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: getTransportationsQuery,
              data: {
                transportations: items.value
              }
            });
          }
        }
      })
    );

    onError((e: Error) => {
      error(e);
    });

    onDone(() => {
      success({ message: 'The transportation have been deleted.' });
    });

    return {
      items,
      columns,
      loading,
      router,
      deleteTransportation,
      edit(data: Transportation) {
        const { item } = useTransportation();
        item.value = cloneDeep(data);
        void router.push({
          name: 'EditTransportation',
          params: { id: data._id },
        });
      },
      remove(data: Transportation) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this transportation?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteTransportation({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="Transportations"
      :rows="items"
      :columns="columns"
      color="primary"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-pagination
      createRoute="CreateTransportation"
    >
      <template v-slot:body-cell-prices="props">
        <q-td key="prices" :props="props" class="tw-text-left">
          <div style="min-width: 300px;" v-if="props.row.prices.length">
            <div class="tw-grid tw-grid-cols-3 tw-gap-4">
              <div class="tw-font-medium">Pax. min</div>
              <div class="tw-font-medium">Pax. max</div>
              <div class="tw-font-medium">Price</div>
            </div>
            <div
              v-for="(price) in props.row.prices"
              :key="price.id"
              class="tw-grid tw-grid-cols-3 tw-gap-4"
            >
              <div>{{price.min}}</div>
              <div>{{price.max}}</div>
              <div>{{price.price}}</div>
            </div>
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-locations="props">
        <q-td key="locations" :props="props" class="tw-text-left">
          <div style="min-width: 500px;" v-if="props.row.routes.length">
            <div class="tw-grid tw-grid-cols-3 tw-gap-4">
              <div class="tw-font-medium">From</div>
              <div class="tw-font-medium">To</div>
              <div class="tw-font-medium">Km</div>
            </div>
            <div
              v-for="(route) in props.row.routes"
              :key="route.id"
              class="tw-grid tw-grid-cols-3 tw-gap-4"
            >
              <div>{{route.locationFrom.name}}</div>
              <div>{{route.locationTo.name}}</div>
              <div>{{route.kms}}</div>
            </div>
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
