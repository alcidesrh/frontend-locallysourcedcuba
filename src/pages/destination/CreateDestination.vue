<script lang="ts">
import { defineComponent } from 'vue';
import FormDestination from './destinationForm/FormDestination.vue';
import useDestination from './destinationService';
import { useMutation } from '@vue/apollo-composable';
import {
  createDestinationMutation,
  listDestinationQuery,
} from 'src/graphql/query/destination.graphql';
import { useRouter } from 'vue-router';
import { error } from 'src/helpers/notification';
import { Destination } from 'src/graphql/@types/types';

export default defineComponent({
  setup() {
    const { item, variablesListQuery } = useDestination();

    item.value = {};

    const { mutate: createDestination, loading, onError, onDone } = useMutation(
      createDestinationMutation,
      () => ({
        update: (
          cache,
          {
            data: {
              createDestination: { destination },
            },
          }
        ) => {
          const value: unknown = { ...destination, ...item.value };

          const data: {
            listDestinations: {
              collection: Partial<Destination>[];
              paginationInfo: Record<string, unknown>;
            };
          } | null = cache.readQuery({
            query: listDestinationQuery,
            variables: variablesListQuery.value,
          });
          cache.writeQuery({
            query: listDestinationQuery,
            data: {
              listDestinations: {
                collection: [
                  ...(data?.listDestinations.collection || []),
                  value,
                ],
              },
            },
            variables: variablesListQuery.value,
          });
        },
      })
    );

    const router = useRouter();

    onDone(() => {
      void router.push({ name: 'ListDestination' });
    });

    onError((e: Error) => {
      error(e);
    });

    const onSubmit = () => {
      const value = Object.assign({}, item.value);
      const id = value.province?.id;
      delete value.province;

      void createDestination({ input: { ...value, province: id } });
    };

    return {
      loading,
      cancel() {
        item.value = {};
        void router.push({ name: 'ListDestination' });
      },
      onSubmit,
    };
  },
  components: { FormDestination },
});
</script>

<template>
  <q-page padding>
    <div class="text-subtitle1">New Destination</div>
    <FormDestination @submit="onSubmit" @cancel="cancel" :loading="loading" />
  </q-page>
</template>
