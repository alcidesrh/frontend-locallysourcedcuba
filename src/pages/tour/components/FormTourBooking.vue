<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue';
import { Ref } from '@vue/reactivity/dist/reactivity';
import { Booking, Tour } from 'src/graphql/@types/types';
import { useMutation, useQuery, useApolloClient } from '@vue/apollo-composable';
import {
  bookingHtcQuery,
  createBookingHtcMutation,
  updateBookingHtcMutation,
  deleteBookingMutation,
} from 'src/graphql/query/booking.graphql';
import { error } from 'src/helpers/notification';
import globalLoading from 'src/store/loading';
import { cloneDeep } from 'lodash-es';

export default defineComponent({
  setup() {
    const item = inject('item') as Ref<Tour>;
    const newBooking = ref<Partial<Booking>>({});
    const bookings = ref<Partial<Booking>[]>([]);
    const index = ref(-1);
    const formRef = ref<Record<string, () => void>>({});

    const { client } = useApolloClient();
    const result = client.cache.readQuery({
      query: bookingHtcQuery,
      variables: {
        tourID: item.value.id,
      },
    });

    if (result) {
      bookings.value = cloneDeep(
        (result as Record<'bookings', Booking[]>).bookings
      );
    } else {
      globalLoading.value = true;
      const { onError, onResult } = useQuery(bookingHtcQuery, () => ({
        tourID: item.value.id,
      }));
      onError((e: Error) => {
        error(e);
      });

      onResult((result: { data: { bookings: Booking[] } }) => {
        bookings.value = cloneDeep(result.data.bookings);
        globalLoading.value = false;
      });
    }

    function writeCache() {
      client.cache.writeQuery({
        query: bookingHtcQuery,
        data: {
          bookings: bookings.value,
        },
        variables: {
          tourID: item.value.id,
        },
      });
    }

    const {
      mutate: createBooking,
      loading: loadingCreate,
      onError: onErrorCreate,
    } = useMutation(createBookingHtcMutation, () => ({
      update: (
        cache,
        {
          data: {
            createBooking: { booking },
          },
        }
      ) => {
        if (!item.value.bookings) item.value.bookings = [];
        bookings.value.push(booking);
        newBooking.value = {};
        formRef.value.resetValidation();
        writeCache();
      },
    }));
    onErrorCreate((e: Error) => {
      error(e);
    });

    const {
      mutate: updateBooking,
      loading: loadingUpdate,
      onError: onErrorUpdate,
    } = useMutation(updateBookingHtcMutation, () => ({
      update: (
        cache,
        {
          data: {
            updateBooking: { booking },
          },
        }
      ) => {
        if (bookings.value) bookings.value[index.value] = booking as Booking;
        newBooking.value = {};
        formRef.value.resetValidation();
        writeCache();
      },
    }));
    onErrorUpdate((e: Error) => {
      error(e);
    });

    const {
      mutate: deleteBooking,
      loading: loadingDelete,
      onError: onErrorDelete,
    } = useMutation(deleteBookingMutation, () => ({
      update: (
        cache,
        {
          data: {
            deleteBooking: {
              booking: { id },
            },
          },
        }
      ) => {
        if (bookings.value) {
          bookings.value = (bookings.value as Booking[]).filter(
            (r: Booking) => r.id != id
          );
          writeCache();
        }
      },
    }));
    onErrorDelete((e: Error) => {
      error(e);
    });

    watch(
      [loadingCreate, loadingUpdate, loadingDelete],
      ([v, v2, v3]) => (globalLoading.value = v || v2 || v3)
    );

    return {
      newBooking,
      bookings,
      formRef,
      onSubmit() {
        if (!newBooking.value?.id) {
          void createBooking({
            input: { ...newBooking.value, tour: item.value.id },
          });
        } else {
          void updateBooking({ input: newBooking.value });
        }
      },
      edit(value: Booking) {
        index.value = bookings.value.indexOf(value);
        newBooking.value = Object.assign({}, value);
      },
      remove(id: number) {
        void deleteBooking({ input: { id: id } });
      },
    };
  },
});
</script>

<template >
  <q-form ref="formRef" @submit="onSubmit" class="q-mt-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-8">
        <BaseInput v-model="newBooking.name" label="Booking contact" validate></BaseInput>
      </div>
      <div class="col-6 col-sm-3 col-md-2">
        <BaseInput v-model.number="newBooking.pax" label="Pax. number" validate type="number"></BaseInput>
      </div>
      <div class="col-6 col-sm-3 col-md-2">
        <BaseInput v-model.number="newBooking.lp" label="LP" validate type="number"></BaseInput>
      </div>
      <div class="col-12 tw-text-right">
        <BaseButton label="Save" type="submit" color="primary" class="q-ml-sm" />
      </div>
    </div>
  </q-form>
  <div class="row q-col-gutter-sm tw-mt-5">
    <div class="col-12 col-sm-8">
      <BaseTable
        v-if="bookings.length"
        :rows="bookings"
        :rows-per-page-options="[0]"
        hide-pagination
        :loading="loadingDelete"
        :columns="[{
    label: 'Booking Contact',
    align: 'left',
    field: 'name',
  },
  {
    label: 'Pax. number',
    align: 'left',
    field: 'pax',
  },
  {
    label: 'LP',
    field: 'lp',
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
        <slot></slot>
      </BaseTable>
    </div>
  </div>
</template>
