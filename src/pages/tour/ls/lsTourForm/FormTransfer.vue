<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import { Booking, BookingTransfer, House } from 'src/graphql/@types/types';
import { useApolloClient } from '@vue/apollo-composable';

import {
  createBookingTransferMutation,
  updateBookingTransferMutation,
  perBookingTransfersQuery,
  deleteBookingTransferMutation,
} from 'src/graphql/query/transfer.graphql';
import globalLoading from 'src/store/loading';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash-es';
import useDestination from 'src/pages/destination/destinationService';
import useDriver from 'src/pages/driver/driverService';
import useHouse from 'src/pages/house/houseService';
import { housesQuery } from 'src/graphql/query/house.graphql';

export default defineComponent({
  props: {
    booking: Object,
  },
  setup(props: Record<string, unknown>) {
    const { client } = useApolloClient();
    const booking = props.booking as Booking;
    const loading = ref(false);
    const transferDialog = ref(false);
    const transfers = ref<Partial<BookingTransfer[]>>([]);
    const transfer = ref<Partial<BookingTransfer>>({ note: '' });
    const houses = ref<Partial<House>[]>([]);
    const housesSelected = ref<Partial<House>[]>([]);
    const house = ref<Partial<House>>({ name: '' });
    const bookings = ref<Partial<Booking>[]>([]);
    const date = ref('');
    const datePopup = ref(false);
    const showForm = ref(false);
    const formRef = ref<Record<string, () => void>>({});

    globalLoading.value = true;
    client
      .query({
        query: perBookingTransfersQuery,
        variables: { bookings: [booking._id] },
      })
      .then(({ data: { per_bookingBookingTransfers } }) => {
        transfers.value = cloneDeep(
          per_bookingBookingTransfers
        ) as BookingTransfer[];
      })
      .finally(() => {
        globalLoading.value = false;
        transferDialog.value = true;
      });

    const { destinations } = useDestination();

    const { drivers, lazyList: driverLazyList } = useDriver();

    if (!drivers.value.length) {
      const { getDrivers } = driverLazyList();
      getDrivers();
    }

    const { getHouseByDestination } = useHouse();

    const {
      getHouses,
      onResult: onResultHouse,
      loading: loadingHouse,
    } = getHouseByDestination();

    onResultHouse(
      (result: {
        data: {
          houses: Partial<House>[];
        };
      }) => {
        houses.value = result.data.houses;
      }
    );

    watch(
      () => transfer.value.date,
      (val) => {
        datePopup.value = false;
        if (val)
          date.value = dayjs(transfer.value.date as string).format(
            'DD/MM/YYYY'
          );
      }
    );

    watch(
      () => transfer.value.destination,
      () => {
        houses.value = [];
        if (transfer.value.destination)
          getHouses(housesQuery, {
            destinationID:
              transfer.value.destination?.id || transfer.value.destination,
          });
      }
    );

    return {
      transfersIn: computed(() =>
        transfers.value.filter((t) => t?.type == 'In')
      ),
      transfersOut: computed(() =>
        transfers.value.filter((t) => t?.type == 'Out')
      ),
      transferDialog,
      loading,
      house,
      houses,
      housesSelected,
      loadingHouse,
      drivers,
      destinations,
      datePopup,
      date,
      transfer,
      bookings,
      showForm,
      formRef,
      onSubmit() {
        loading.value = true;
        void client
          .mutate({
            mutation: transfer.value.id
              ? updateBookingTransferMutation
              : createBookingTransferMutation,
            variables: {
              input: {
                ...transfer.value,
                driver: transfer.value.driver?.id || transfer.value.driver,
                destination: transfer.value.destination?.id,
                houses: housesSelected.value.map((h) => h.id),
                bookingIn: transfer.value.type == 'In' ? booking.id : null,
                bookingOut: transfer.value.type == 'Out' ? booking.id : null,
              },
            },
          })
          .then(({ data }) => {
            if (transfer.value.id) {
              transfer.value = (
                data as Record<string, Record<string, BookingTransfer>>
              ).updateBookingTransfer.bookingTransfer;

              const result = client.cache.readQuery({
                query: perBookingTransfersQuery,
                variables: { bookings: [booking._id] },
              }) as Record<string, BookingTransfer[]>;
              transfers.value = cloneDeep(result.per_bookingBookingTransfers);
            } else {
              transfer.value = (
                data as Record<string, Record<string, BookingTransfer>>
              ).createBookingTransfer.bookingTransfer;

              transfers.value.push(transfer.value as BookingTransfer);

              client.cache.writeQuery({
                query: perBookingTransfersQuery,
                data: {
                  per_bookingBookingTransfers: transfers.value,
                },
                variables: { bookings: [booking._id] },
              });
            }
            loading.value = false;
            showForm.value = false;
            date.value = '';
            housesSelected.value = [];
            transfer.value = { note: '' };
            transfer.value = {};
            formRef.value.resetValidation();
          });
      },
      add() {
        date.value = '';
        housesSelected.value = [];
        transfer.value = {
          note: '',
          contact: booking.name,
          persons: booking.pax,
        };
        showForm.value = true;
      },
      edit(t: Partial<BookingTransfer>) {
        housesSelected.value = cloneDeep(t.houses) as House[];
        transfer.value = cloneDeep(t);
        showForm.value = true;
      },
      remove(t: Partial<BookingTransfer>) {
        loading.value = true;
        void client
          .mutate({
            mutation: deleteBookingTransferMutation,
            variables: {
              input: { id: t.id },
            },
          })
          .then(() => {
            transfers.value.splice(
              transfers.value.indexOf(
                transfers.value.find((t2) => t2 && t2.id == t.id)
              ),
              1
            );
            client.cache.writeQuery({
              query: perBookingTransfersQuery,
              data: {
                per_bookingBookingTransfers: transfers.value,
              },
              variables: { bookings: [booking._id] },
            });
            loading.value = false;
          });
      },
      optionsFn(date: string) {
        return date >= dayjs().format('YYYY/MM/DD');
      },
      addHouse() {
        if (!house.value.id) return;
        housesSelected.value.push(house.value);
        house.value = { name: '' };
      },
      removeHouse(h: Partial<House>, index: number) {
        housesSelected.value.splice(index, 1);
      },
    };
  },
});
</script>

<template >
  <q-dialog v-model="transferDialog">
    <q-card style="width: 100%; max-width: 900px">
      <BaseLoading :showing="loading" />
      <q-card-section class="row items-center tw-py-3 bg-primary tw-mb-7">
        <div class="tw-relative tw-w-full">
          <div
            class="text-h6 tw-text-white tw-pr-5"
          >Booking: {{booking.name}}. Pax number: {{booking.pax}}</div>
          <q-btn
            class="tw-absolute tw-top-0 tw-right-0 tw--mr-3 tw--mt-2"
            icon="close"
            flat
            round
            dense
            v-close-popup
            color="white"
          />
        </div>
      </q-card-section>

      <div class="tw-my-5">
        <div class="row">
          <div class="col-6 tw-border-r-2 tw-px-5">
            <h4>Transfers In:</h4>
            <div v-if="transfersIn.length">
              <span v-for="(t,i) in transfersIn" :key="i">
                <q-chip v-if="t" class="tw-mr-2 tw-py-3 tw-my-2">
                  <div
                    class="tw-p-0 tw-font-semibold tw-text-white tw-flex tw-items-center tw-max-w-xs"
                  >
                    <p
                      class="tw-bg-gray-700 tw-tracking-widest tw-cursor-pointer; tw-truncate"
                      style="border-radius: 50px; padding: 0px 10px;"
                    >{{t?.contact}}</p>

                    <span
                      class="tw-ml-5 tw-bg-gray-700 tw-tracking-widest"
                      style="border-radius: 50px; padding: 0px 10px;"
                    >
                      <q-icon
                        @click="edit(t)"
                        class="q-mr-sm"
                        name="edit"
                        color="teal"
                        style="font-size: 20px; cursor: pointer"
                      />
                      <q-icon
                        @click="remove(t)"
                        name="delete"
                        color="negative"
                        style="font-size: 20px; cursor: pointer"
                      />
                    </span>
                  </div>
                </q-chip>
                <q-tooltip>
                  <div class="tw-text-base tw-font-black">{{t?.contact}}</div>
                  <div class="tw-text-sm">
                    Pax:
                    <span class="tw-font-semibold">{{t?.persons}}</span>
                  </div>
                  <div class="tw-text-sm">
                    Destination:
                    <span class="tw-font-semibold">{{t?.destination?.name}}</span>
                  </div>
                  <div class="tw-text-sm">
                    Driver:
                    <span class="tw-font-semibold">{{t?.driver?.name}}</span>
                  </div>
                </q-tooltip>
              </span>
            </div>
            <div v-else class="tw-p-10 tw-text-center tw-text-gray-400 tw-font-semibold tw-text-md">
              <label>No transfer found</label>
            </div>
          </div>
          <div class="col-6 tw-px-5">
            <h4>Transfers Out:</h4>
            <div v-if="transfersOut.length">
              <span v-for="(t,i) in transfersOut" :key="i">
                <q-chip v-if="t" class="tw-mr-2 tw-py-3 tw-my-2">
                  <div
                    class="tw-p-0 tw-font-semibold tw-text-white tw-flex tw-items-center tw-max-w-xs"
                  >
                    <p
                      class="tw-bg-gray-700 tw-tracking-widest tw-cursor-pointer; tw-truncate"
                      style="border-radius: 50px; padding: 0px 10px;"
                    >{{t?.contact}}</p>

                    <span
                      class="tw-ml-5 tw-bg-gray-700 tw-tracking-widest"
                      style="border-radius: 50px; padding: 0px 10px;"
                    >
                      <q-icon
                        @click="edit(t)"
                        class="q-mr-sm"
                        name="edit"
                        color="teal"
                        style="font-size: 20px; cursor: pointer"
                      />
                      <q-icon
                        @click="remove(t)"
                        name="delete"
                        color="negative"
                        style="font-size: 20px; cursor: pointer"
                      />
                    </span>
                  </div>
                </q-chip>
                <q-tooltip>
                  <div class="tw-text-base tw-font-black">{{t?.contact}}</div>
                  <div class="tw-text-sm">
                    Pax:
                    <span class="tw-font-semibold">{{t?.persons}}</span>
                  </div>
                  <div class="tw-text-sm">
                    Destination:
                    <span class="tw-font-semibold">{{t?.destination?.name}}</span>
                  </div>
                  <div class="tw-text-sm">
                    Driver:
                    <span class="tw-font-semibold">{{t?.driver?.name}}</span>
                  </div>
                </q-tooltip>
              </span>
            </div>
            <div v-else class="tw-p-10 tw-text-center tw-text-gray-400 tw-font-semibold tw-text-md">
              <label>No transfer found</label>
            </div>
          </div>
        </div>
        <div class="tw-flex tw-justify-center tw-mt-5">
          <base-button @click="add" label="New transfer" color="primary" class="q-ml-sm" />
        </div>
      </div>

      <div v-if="showForm" class="tw-px-5">
        <q-separator></q-separator>
        <q-form @submit="onSubmit" class="q-mt-md" ref="formRef">
          <q-card-section class="q-pt-none">
            <div class="row q-col-gutter-md">
              <div class="col-6 col-sm-3 col-md-2">
                <BaseSelect
                  class="tw-w-full"
                  :options="['In', 'Out']"
                  label="Type"
                  v-model="transfer.type"
                ></BaseSelect>
              </div>
            </div>

            <div class="row q-col-gutter-md tw-mt-0">
              <div class="col-9 col-md-8">
                <BaseInput v-model="transfer.contact" label="Contact" validate></BaseInput>
              </div>
              <div class="col-3 col-md-3">
                <BaseInput v-model.number="transfer.persons" label="Pax" validate type="number"></BaseInput>
              </div>
            </div>

            <div class="row q-col-gutter-md tw-mt-0">
              <div class="col-4">
                <BaseSelect
                  clearable
                  v-model="transfer.destination"
                  :options="destinations"
                  label="Destination"
                  option-label="name"
                  option-value="id"
                  map-options
                  validate
                ></BaseSelect>
              </div>
              <div class="col-4">
                <BaseSelect
                  v-model="transfer.driver"
                  :options="drivers"
                  label="Driver"
                  option-label="name"
                  option-value="id"
                  emit-value
                  map-options
                  validate
                ></BaseSelect>
              </div>
              <div class="col-4 col-md-3">
                <BaseInput v-model.number="transfer.price" label="Price" validate type="number"></BaseInput>
              </div>
            </div>

            <div class="row q-col-gutter-md tw-mt-0">
              <div class="col-6 col-sm-3">
                <BaseInput readonly v-model="date" validate label="Date">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        v-model="datePopup"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          minimal
                          v-model="transfer.date"
                          default-view="Months"
                          :options="optionsFn"
                        ></q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </BaseInput>
              </div>
              <div class="col-6 col-sm-3">
                <BaseInput readonly v-model="transfer.hour" validate label="Time">
                  <template v-slot:append>
                    <q-icon name="schedule" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="transfer.hour">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </BaseInput>
              </div>
              <div class="col-12 col-sm-6 col-md-5">
                <BaseInput v-model="transfer.flightData" label="Fly data" validate></BaseInput>
              </div>
            </div>

            <div class="row q-col-gutter-md tw-mt-0">
              <div class="col-4 col-md-3">
                <BaseInput readonly v-model="transfer.fromHour" validate label="From hour">
                  <template v-slot:append>
                    <q-icon name="schedule" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="transfer.fromHour">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </BaseInput>
              </div>
              <div class="col-4 col-md-3">
                <BaseInput readonly v-model="transfer.toHour" validate label="To hour">
                  <template v-slot:append>
                    <q-icon name="schedule" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-time v-model="transfer.toHour">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-time>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </BaseInput>
              </div>
              <div class="col-4 col-sm-3">
                <BaseInput v-model.number="transfer.charge" label="Charge" validate type="number"></BaseInput>
              </div>
            </div>

            <div class="row q-col-gutter-md tw-mt-0">
              <div class="col-9 col-sm-6 tw-flex tw-items-center">
                <BaseSelect
                  class="tw-w-full"
                  :disable="!houses.length"
                  :loading="loadingHouse"
                  v-model="house"
                  :options="houses.filter(h => !housesSelected.map(h => h.id).includes(h.id))"
                  label="Accommodation"
                  option-label="name"
                ></BaseSelect>
              </div>
              <div class="col tw-flex tw-items-center">
                <q-btn
                  round
                  color="primary"
                  icon="add"
                  class="tw-ml-2"
                  size="sm"
                  @click="addHouse()"
                />
              </div>
              <div class="col-9" v-if="housesSelected.length">
                <ul class="tw-list-disc tw-list-inside tw-pl-2">
                  <li v-for="(h, index) in housesSelected" :key="h.id" class="tw-mb-2">
                    {{h.name}}
                    <q-icon
                      name="delete"
                      color="negative"
                      style="font-size: 20px; cursor: pointer;"
                      @click="removeHouse(h, index)"
                    />
                  </li>
                </ul>
              </div>
              <div class="col-12 tw-mt-3">
                <BaseEditor v-model="transfer.note" placeholder="Note"></BaseEditor>
              </div>
            </div>

            <div class="row q-col-gutter-sm tw-mt-0">
              <div class="col-12 tw-flex tw-justify-end">
                <base-button
                  @click="showForm = false"
                  label="Cancel"
                  color="primary"
                  class="q-ml-sm"
                />
                <base-button
                  :loading="loading"
                  label="Save"
                  type="submit"
                  color="primary"
                  class="q-ml-sm"
                />
              </div>
            </div>
          </q-card-section>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>
