<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import useLocation from 'src/pages/location/locationService';
import useTransportation from 'src/pages/transportation/transportationService';
import { Location, TransportationRoute } from 'src/graphql/@types/types.d';
import {
  createTransportationRouteMutation,
  deleteTransportationRouteMutation,
  updateTransportationRouteMutation,
} from 'src/graphql/query/transportation.graphql';
import { useMutation } from '@vue/apollo-composable';
import { pick } from 'lodash-es';

export default defineComponent({
  setup() {
    const { item: transportation } = useTransportation();

    const { locations, lazyList } = useLocation();

    const { getLocations } = lazyList();

    if (!locations.value.length) getLocations();

    const locationsFrom = ref<Partial<Location>[]>([]);
    const locationsTo = ref<Partial<Location>[]>([]);

    const routes = ref<Partial<TransportationRoute>[]>([]);
    routes.value = transportation.value
      .routes as Partial<TransportationRoute>[];

    const item = ref<Partial<TransportationRoute>>({});

    const { mutate: createTransportationRoute, loading: loadingCreate } =
      useMutation(createTransportationRouteMutation, () => ({
        update: (
          cache,
          {
            data: {
              createTransportationRoute: { transportationRoute },
            },
          }
        ) => {
          routes.value.push(transportationRoute);
          formRef.value.resetValidation();
          item.value = {};
        },
      }));

    const { mutate: updateTransportationRoute, loading: loadingUpdate } =
      useMutation(updateTransportationRouteMutation, () => ({
        update: (
          cache,
          {
            data: {
              updateTransportationRoute: { transportationRoute },
            },
          }
        ) => {
          if (routes.value)
            routes.value[index.value] =
              transportationRoute as TransportationRoute;
          item.value = {};
          formRef.value.resetValidation();
        },
      }));

    const { mutate: deleteTransportationRoute, loading: loadingDelete } =
      useMutation(deleteTransportationRouteMutation, () => ({
        update: (
          cache,
          {
            data: {
              deleteTransportationRoute: {
                transportationRoute: { id },
              },
            },
          }
        ) => {
          if (routes.value) {
            transportation.value.routes = routes.value = (
              routes.value as TransportationRoute[]
            ).filter((t: TransportationRoute) => t.id != id);
          }
        },
      }));

    const formRef = ref<Record<string, () => void>>({});

    const updateSeasonRoomLoading = ref<boolean[]>([]);

    const index = ref<number>(0);

    return {
      updateSeasonRoomLoading,
      formRef,
      item,
      routes,
      locationsFrom,
      locationsTo,
      loadingDelete,
      loading: computed(() => loadingCreate.value || loadingUpdate.value),
      onSubmit() {
        if (item.value.id) {
          void updateTransportationRoute({
            input: {
              ...item.value,
              locationFrom:
                item.value.locationFrom?.id || item.value.locationFrom,
              locationTo: item.value.locationTo?.id || item.value.locationTo,
            },
          });
        } else
          void createTransportationRoute({
            input: {
              ...item.value,
              transportation: transportation.value.id,
            },
          });
      },
      remove(id: string) {
        void deleteTransportationRoute({
          input: { id: id },
        });
      },
      filterFrom(val: string, update: (fn: () => void) => void) {
        if (val === '') {
          update(() => {
            locationsFrom.value = locations.value;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          locationsFrom.value = locations.value.filter((v) => {
            if (v.name) return v.name.toLowerCase().indexOf(needle) > -1;
            return false;
          });
        });
      },
      filterTo(val: string, update: (fn: () => void) => void) {
        if (val === '') {
          update(() => {
            locationsTo.value = locations.value;
          });
          return;
        }

        update(() => {
          const needle = val.toLowerCase();
          locationsTo.value = locations.value.filter((v) => {
            if (v.name) return v.name.toLowerCase().indexOf(needle) > -1;
            return false;
          });
        });
      },
      edit(v: TransportationRoute) {
        index.value = routes.value.indexOf(v);
        item.value = pick(v, ['id', 'locationFrom', 'locationTo']);
      },
    };
  },
});
</script>


<template >
  <q-form ref="formRef" @submit="onSubmit" class="q-mt-md">
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-4">
        <BaseSelect
          v-model="item.locationFrom"
          :options="locationsFrom"
          label="From"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          validate
          use-input
          @filter="filterFrom"
        ></BaseSelect>
      </div>
      <div class="col-12 col-sm-4">
        <BaseSelect
          :disable="!item.locationFrom"
          v-model="item.locationTo"
          :options="locationsTo"
          label="To"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          validate
          use-input
          @filter="filterTo"
        ></BaseSelect>
      </div>
      <div class="col-12 col-sm-4 tw-flex tw-items-center tw-justify-end sm:tw-justify-start">
        <BaseButton
          :label="item.id ? 'Update' : 'Add'"
          :icon="item.id ? 'refresh' : 'add'"
          type="submit"
          color="primary"
          class="q-ml-sm"
          :loading="loading"
        />
      </div>
    </div>
  </q-form>
  <div class="row q-col-gutter-sm tw-mt-5">
    <div class="col-12 col-sm-8">
      <BaseTable
        v-if="routes.length"
        :rows="routes"
        :rows-per-page-options="[0]"
        hide-pagination
        :loading="loadingDelete"
        :columns="[{
    label: 'From',
    align: 'left',
    field: (row) => row.locationFrom.name,
  },
  {
    label: 'To',
    align: 'left',
    field: (row) => row.locationTo.name
  },
  {
    label: 'Kms',
    align: 'left',
    field: (row) => row.kms
  },
  { name: 'icon', label: '', field: '', align: 'right' }]"
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
              @click="remove(props.row.id)"
            />
          </q-td>
        </template>
      </BaseTable>
    </div>
  </div>
</template>
