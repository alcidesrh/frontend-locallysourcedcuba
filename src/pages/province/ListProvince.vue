<script lang="ts">
import { Province } from 'src/graphql/@types/types';
import { defineComponent } from 'vue';
import useProvince from './provinceService';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import { deleteMutation, listQuery } from 'src/graphql/query/province.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';

const columns = [
  {
    name: 'name',
    label: 'Name',
    field: 'name',
    align: 'left',
  },
  { name: 'icon' },
];

export default defineComponent({
  setup() {
    const router = useRouter();
    const $q = useQuasar();
    let { list, items } = useProvince();

    let { loading } = list();

    const { mutate: deleteProvince, onError, onDone } = useMutation(
      deleteMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              deleteProvince: {
                province: { id },
              },
            },
          }
        ) => {
          let data: Record<string, []> | null = cache.readQuery({
            query: listQuery,
          });
          if (data) {
            items.value = data.provinces.filter(
              (i: { id: string }) => i.id != id
            );

            cache.writeQuery({
              query: listQuery,
              data: {
                provinces: items.value,
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
      deleteProvince,
      edit(data: Province) {
        const { item } = useProvince();
        item.value = Object.assign({}, data);
        void router.push({ name: 'EditProvince', params: { id: data._id } });
      },
      remove(data: Province) {
        $q.dialog({
          title: 'Confirm',
          message: 'Would you like to delete this item?',
          cancel: true,
          persistent: true,
        }).onOk(() => {
          void deleteProvince({ input: { id: data.id } });
        });
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <BaseTable
      title="Provinces"
      :columns="columns"
      :rows="items"
      :loading="loading"
      :rows-per-page-options="[0]"
      hide-pagination
      createRoute="CreateProvince"
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
