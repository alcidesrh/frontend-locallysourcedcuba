<script lang="ts">
import { Service } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useService from './serviceService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteServiceMutation,
  listServiceQuery,
} from 'src/graphql/query/service.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  {
    name: 'code',
    label: 'Code',
    field: 'code',
    align: 'left',
  },
  {
    name: 'daysToShow',
    label: 'Days to Show',
    field: 'daysToShow',
    align: 'left',
  },

  { name: 'icon' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items } = useService();

    let { loading } = list();

    const { mutate: deleteService, onError, onDone } = useMutation(
      deleteServiceMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteService: {
                service: { id },
              },
            },
          }
        ) => {
          let data: Record<string, []> | null = cache.readQuery({
            query: listServiceQuery,
          });
          if (data) {
            items.value = data.services.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listServiceQuery,
              data: {
                services: items.value,
              },
            });
          }
        },
      })
    );

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
      deleteService,
      edit(data: Service) {
        const { item } = useService();
        item.value = Object.assign({}, data);
        void router.push({ name: 'EditService', params: { id: data._id } });
      },
      remove(data: Service) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this item?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteService({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="Services"
      :columns="columns"
      :rows="items"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-pagination
      createRoute="CreateService"
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
