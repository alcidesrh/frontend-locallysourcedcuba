<script lang="ts">
import { defineComponent, inject, watch, ref } from 'vue';
import dayjs from 'dayjs';
import { useNotifications } from 'src/pages/notification/notificationService';
import useDriver from 'src/pages/driver/driverService';
import notificationType from 'src/pages/tour/components/notificationTypeService';
import { Service } from 'src/graphql/@types/types';
import { Ref } from '@vue/reactivity/dist/reactivity';
import useTransfer from './transferService';

export default defineComponent({
  setup() {
    const { list, search } = useTransfer();

    const { lazyList, drivers } = useDriver();
    if (!drivers.value.length) {
      const { getDrivers } = lazyList();
      getDrivers();
    }
    const { getTransfer, loading } = list();

    const filter = ref(
      !!Object.entries(search.value).filter(
        (e: [string, unknown]) =>
          e[0] != 'service' && e[1] && (e[1] as []).length
      ).length
    );

    const fromDatePopup = ref(false);
    const fromDate = ref(
      search.value.from ? dayjs(search.value.from).format('DD/MM/YYYY') : null
    );
    const toDatePopup = ref(false);
    const toDate = ref(
      search.value.to ? dayjs(search.value.to).format('DD/MM/YYYY') : null
    );

    const service = inject('service') as Ref<Partial<Service>>;

    const { getNotifications, notifications } = useNotifications();
    if (notificationType.value != service.value.code) {
      notificationType.value = service.value.code as string;
      getNotifications(service.value.code as string);
    }

    let timeout: unknown;
    watch(
      () => search.value.needle,
      (val) => {
        if (!val) {
          getTransfer();
          return;
        }
        clearTimeout(timeout as number);
        timeout = setTimeout(() => {
          getTransfer();
        }, 1000);
      }
    );

    watch(
      [() => search.value.from, () => search.value.to],
      ([newFrom, newTo]) => {
        fromDatePopup.value = toDatePopup.value = false;
        if (newFrom) fromDate.value = dayjs(newFrom).format('DD/MM/YYYY');
        if (newTo) toDate.value = dayjs(newTo).format('DD/MM/YYYY');
      }
    );

    watch([fromDate, toDate], ([newFrom, newTo]) => {
      if (!newFrom) {
        search.value.from = search.value.to = toDate.value = '';
        getTransfer();
      }
      if (!newTo) search.value.to = '';
    });

    watch(
      () => search.value.driver,
      (val) => {
        if (!val) getTransfer();
      }
    );

    return {
      loading,
      drivers,
      search,
      filter,
      fromDatePopup,
      fromDate,
      toDatePopup,
      toDate,
      notifications,
      onSubmit: () => {
        getTransfer();
      },
      reset() {
        search.value = {
          needle: '',
          from: '',
          to: '',
          notification: [] as number[],
          notificationComplete: null,
          driver: null,
          type: '',
        };
        fromDate.value = toDate.value = '';
        getTransfer();
      },
      removeChip(index: number) {
        (search.value.notification as []).splice(index, 1);
      },
    };
  },
});
</script>

<template >
  <q-form class="tw-w-full" @submit="onSubmit">
    <div class="row q-col-gutter-md">
      <div class="col" style="max-width: 400px;">
        <BaseInput v-model="search.needle" label="Code, contact name or guide name">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </BaseInput>
      </div>
      <div class="col tw-flex tw-items-center">
        <BaseButton
          :label="filter ? 'Hide filters' : 'Show filters'"
          type="button"
          color="primary"
          class="q-ml-sm"
          @click="filter = !filter"
        />
        <BaseButton
          v-show="filter"
          label="Clean filter"
          type="button"
          color="primary"
          class="q-ml-sm"
          @click="reset"
        />
      </div>
    </div>

    <div v-show="filter">
      <div class="row q-col-gutter-md tw-mt-3">
        <div class="col-12 col-sm-6 col-md-3 col-lg-2">
          <BaseInput v-model="fromDate" label="From" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-icon
                  v-if="fromDate"
                  name="cancel"
                  @click.stop="fromDate = null"
                  class="cursor-pointer tw-mr-2"
                />
                <q-popup-proxy
                  v-model="fromDatePopup"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date minimal v-model="search.from" default-view="Months"></q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </BaseInput>
        </div>
        <div class="col-12 col-sm-6 col-md-3 col-lg-2">
          <BaseInput readonly v-model="toDate" label="To">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-icon
                  v-if="toDate"
                  name="cancel"
                  @click.stop="toDate = null"
                  class="cursor-pointer tw-mr-2"
                />
                <q-popup-proxy
                  v-model="toDatePopup"
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    minimal
                    v-model="search.to"
                    default-view="Months"
                    :options="(date) => search.from && date > search.from"
                  ></q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </BaseInput>
        </div>
      </div>

      <div class="row q-col-gutter-md tw-mt-3">
        <div class="col-12 col-md-6 col-lg-5">
          <BaseSelect
            v-model="search.notification"
            :options="notifications"
            label="Notifications"
            option-label="name"
            option-value="slug"
            emit-value
            map-options
            autocomplete
            use-input
            multiple
            options-selected-class="text-deep-orange"
          >
            <template v-slot:selected-item="{opt, index}">
              <q-chip class="tw-mr-2" removable @remove="removeChip(index)">
                <q-icon
                  v-if="opt.icon"
                  :name="opt.icon"
                  class="tw-text-2xl notification-icon-color"
                ></q-icon>
                <label class="tw-ml-2">{{opt.name}}</label>
              </q-chip>
            </template>
            <template v-slot:option="{ opt, itemProps, toggleOption }">
              <q-item v-bind="itemProps" @click="toggleOption(opt)">
                <q-item-section avatar>
                  <q-icon
                    v-if="opt.icon"
                    :name="opt.icon"
                    class="tw-text-2xl notification-icon-color"
                    :class="{'text-deep-orange': search.notification.includes(opt._id)}"
                  ></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ opt.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </BaseSelect>
        </div>
        <div class="col-12 col-md-6 col-lg-4 tw-flex tw-items-center">
          <q-radio
            :disable="!search.notification.length"
            v-model="search.notificationComplete"
            :val="null"
            label="All"
          />
          <q-radio
            :disable="!search.notification.length"
            v-model="search.notificationComplete"
            :val="false"
            label="Incomplete"
          />
          <q-radio
            :disable="!search.notification.length"
            v-model="search.notificationComplete"
            :val="true"
            label="Complete"
          />
        </div>
      </div>

      <div class="row q-col-gutter-md tw-mt-3">
        <div class="col-12 col-md-6 col-lg-4">
          <BaseSelect
            v-model="search.driver"
            :options="drivers"
            label="Drivers"
            option-label="name"
            option-value="_id"
            emit-value
            map-options
            autocomplete
            clearable
          ></BaseSelect>
        </div>
      </div>

      <div class="row q-col-gutter-md tw-mt-3">
        <div class="col-12 col-md-6 col-lg-4">
          <BaseSelect
            v-model="search.type"
            :options="['In', 'Out']"
            label="Type"
            emit-value
            map-options
            autocomplete
            clearable
          ></BaseSelect>
        </div>
      </div>

      <div class="row q-col-gutter-md tw-mt-3">
        <div class="col-12 col-md-6 col-lg-4 tw-flex tw-justify-end">
          <BaseButton
            v-if="filter"
            :loading="loading"
            label="Search"
            type="submit"
            color="primary"
            class="q-ml-sm"
          />
        </div>
      </div>
    </div>
  </q-form>
</template>
