<script lang="ts">
import { defineComponent } from 'vue';
import FormTransportation from './transportationForm/FormTransportation.vue';
import useTransportation from './transportationService';
import { useMutation } from '@vue/apollo-composable';

import {
  updateTransportationMutation,
  getTransportationsQuery,
} from 'src/graphql/query/transportation.graphql';
import { useRoute, useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Transportation } from 'src/graphql/@types/types';
import { pick } from 'lodash-es';

export default defineComponent({
  setup() {
    const { item, items, getItem, transportationFormStep } =
      useTransportation();

    const route = useRoute();

    if (!item.value.id && route.params.id) {
      getItem(route.params.id as string);
    }

    const {
      mutate: updateTransportation,
      onError,
      onDone,
      loading,
    } = useMutation(updateTransportationMutation, () => ({
      update: (cache) => {
        const data: Record<string, Partial<Transportation>[]> | null =
          cache.readQuery({
            query: getTransportationsQuery,
          });
        if (data) items.value = data.transportations;
      },
    }));

    onError((e: Error) => {
      error(e);
    });

    const router = useRouter();

    onDone(() => {
      transportationFormStep.value = 2;
    });

    const onSubmit = () => {
      const value = pick(item.value, ['id', 'name', 'driver']);

      void updateTransportation({
        input: {
          ...value,
          driver: value.driver?.id || value.driver,
        },
      });
    };

    return {
      onSubmit,
      item,
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListTransportation' });
      },
    };
  },
  components: { FormTransportation },
});
</script>

<template>
  <q-page padding>
    <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-mb-5 tw-mt-2">
      <div class="text-subtitle1">Edit Transportation</div>
      <div class="tw-flex tw-align-middle tw-justify-end">
        <BaseButton label="Back To The List" icon="arrow_back" type="button" @click="cancel" />
      </div>
    </div>
    <FormTransportation v-if="item" @submit="onSubmit" :loading="loading" />
  </q-page>
</template>
