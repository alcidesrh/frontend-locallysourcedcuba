<script lang="ts">
import useTransportation from 'src/pages/transportation/transportationService';
import { defineComponent, ref, computed } from 'vue';
import { TransportationPrice } from 'src/graphql/@types/types.d';
import {
  createTransportationPriceMutation,
  deleteTransportationPriceMutation,
  updateTransportationPriceMutation,
} from 'src/graphql/query/transportation.graphql';
import { useMutation } from '@vue/apollo-composable';
import { error } from 'src/helpers/notification';

export default defineComponent({
  setup() {
    const { item, transportationFormStep } = useTransportation();

    const prices = ref(
      (item.value.prices as Partial<TransportationPrice>[]) || []
    );

    const transportationPriceItem = ref<Partial<TransportationPrice>>({});

    const {
      mutate: createTransportationPrice,
      loading: loadingCreate,
      onError,
    } = useMutation(createTransportationPriceMutation, () => ({
      update: (
        cache,
        {
          data: {
            createTransportationPrice: {
              transportationPrice: { id },
            },
          },
        }
      ) => {
        formRef.value.resetValidation();
        prices.value.push({
          ...transportationPriceItem.value,
          id: id as string,
        });
        transportationPriceItem.value = {};
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    const {
      mutate: deleteTransportationPrice,
      loading: loadingDelete,
      onError: onErrorDelete,
    } = useMutation(deleteTransportationPriceMutation, () => ({
      update: (
        cache,
        {
          data: {
            deleteTransportationPrice: {
              transportationPrice: { id },
            },
          },
        }
      ) => {
        if (prices.value) {
          item.value.prices = prices.value = (prices.value as TransportationPrice[]).filter(
            (r: TransportationPrice) => r.id != id
          );
        }
      },
    }));

    onErrorDelete((e: Error) => {
      error(e);
    });

    const index = ref(-1);

    const {
      mutate: updateTransportationPrice,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateTransportationPriceMutation, () => ({
      update: (
        cache,
        {
          data: {
            updateTransportationPrice: { transportationPrice },
          },
        }
      ) => {
        if (prices.value)
          prices.value[
            index.value
          ] = transportationPrice as TransportationPrice;
        transportationPriceItem.value = {};
        formRef.value.resetValidation();
      },
    }));

    onErrorUpdate((e: Error) => {
      error(e);
    });

    const loading = computed(() => loadingCreate.value || loadingUpdate.value);

    const formRef = ref<Record<string, () => void>>({});

    return {
      prices,
      transportationPriceItem,
      transportationFormStep,
      loading,
      loadingDelete,
      formRef,
      onSubmit() {
        if (transportationPriceItem.value.id) {
          void updateTransportationPrice({
            input: transportationPriceItem.value,
          });
        } else
          void createTransportationPrice({
            input: {
              transportation: item.value.id,
              ...transportationPriceItem.value,
            },
          });
      },
      remove(id: number) {
        void deleteTransportationPrice({ input: { id: id } });
      },
      edit(value: TransportationPrice) {
        index.value = prices.value.indexOf(value);
        transportationPriceItem.value = Object.assign({}, value);
      },
    };
  },
});
</script>


<template >
  <q-form ref="formRef" @submit="onSubmit" class="q-mt-md">
    <div class="tw-grid tw-grid-cols-1 sm:tw-grid-cols-4 tw-gap-4">
      <div>
        <BaseInput v-model.number="transportationPriceItem.min" label="Min" type="number" validate></BaseInput>
      </div>
      <div>
        <BaseInput v-model.number="transportationPriceItem.max" label="Max" type="number" validate></BaseInput>
      </div>
      <div>
        <BaseInput
          v-model.number="transportationPriceItem.price"
          label="Price"
          type="number"
          validate
        ></BaseInput>
      </div>
      <div class="tw-flex tw-items-center tw-justify-end sm:tw-justify-start">
        <BaseButton
          :label="transportationPriceItem.id ? 'Update' : 'Add'"
          :icon="transportationPriceItem.id ? 'refresh' : 'add'"
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
        v-if="prices.length"
        :rows="prices"
        :rows-per-page-options="[0]"
        hide-pagination
        :loading="loadingDelete"
        :columns="[{
    label: 'Min',
    align: 'left',
    field: 'min',
  },
  {
    label: 'Max',
    align: 'left',
    field: 'max',
  },
  {
    label: 'Price',
    field: 'price',
    align: 'left',
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
