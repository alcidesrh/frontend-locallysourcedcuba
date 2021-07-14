<script lang="ts">
import { defineComponent } from 'vue';
import FormTransportation from './transportationForm/FormTransportation.vue';
import useTransportation from './transportationService';
import { useMutation } from '@vue/apollo-composable';
import {
  createTransportationMutation,
  getTransportationsQuery,
  updateTransportationMutation,
} from 'src/graphql/query/transportation.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Transportation } from 'src/graphql/@types/types';
import { omit, pick } from 'lodash-es';

export default defineComponent({
  setup() {
    const { items, item, transportationFormStep } = useTransportation();

    item.value = {};

    const {
      mutate: createTransportation,
      loading,
      onError,
      onDone,
    } = useMutation(createTransportationMutation, () => ({
      update: (
        cache,
        {
          data: {
            createTransportation: { transportation },
          },
        }
      ) => {
        const value: unknown = { ...transportation, ...item.value };

        item.value = value as Transportation;

        const data: {
          transportations: Partial<Transportation>[];
        } | null = cache.readQuery({
          query: getTransportationsQuery,
        });
        cache.writeQuery({
          query: getTransportationsQuery,
          data: {
            transportations: [...(data?.transportations || []), value],
          },
        });
      },
    }));

    const router = useRouter();

    onDone(() => {
      item.value.prices = [];
      item.value.routes = [];
      transportationFormStep.value = 2;
    });

    onError((e: Error) => {
      error(e);
    });

    const {
      mutate: updateTransportation,
      onError: onErrorUpdate,
      onDone: onDoneUpdate,
      loading: loadingUpdate,
    } = useMutation(updateTransportationMutation, () => ({
      update: (cache) => {
        const data: Record<string, Partial<Transportation>[]> | null =
          cache.readQuery({
            query: getTransportationsQuery,
          });
        if (data) items.value = data.transportations;
      },
    }));

    onErrorUpdate((e: Error) => {
      error(e);
    });

    onDoneUpdate(() => {
      transportationFormStep.value = 2;
    });

    const onSubmit = () => {
      if (item.value.id) {
        void updateTransportation({
          input: pick(item.value, ['id', 'name', 'driver']),
        });
      } else void createTransportation({ input: omit(item.value, ['id']) });
    };

    return {
      loading,
      loadingUpdate,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListTransportation' });
      },
      onSubmit,
    };
  },
  components: { FormTransportation },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">New Transportation</div>
      <div class="tw-flex tw-align-middle tw-justify-end">
        <BaseButton
          label="Back To The List"
          icon="arrow_back"
          type="button"
          @click="cancel"
          color="secondary"
          size="sm"
        />
      </div>
    </div>
    <FormTransportation @submit="onSubmit" @cancel="cancel" :loading="loading || loadingUpdate" />
  </q-page>
</template>
