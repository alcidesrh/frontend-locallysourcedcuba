<script lang="ts">
import { defineComponent, inject, watch, ref } from 'vue';
import dayjs from 'dayjs';
import { useNotifications } from 'src/pages/notification/notificationService';
import notificationType from 'src/pages/tour/components/notificationTypeService';
import { Service } from 'src/graphql/@types/types';
import { Ref } from '@vue/reactivity/dist/reactivity';

export default defineComponent({
  setup() {
    const filter = ref(false);
    const fromDatePopup = ref(false);
    const fromDate = ref('');
    const toDatePopup = ref(false);
    const toDate = ref('');

    const getTours = inject('getTours') as () => void;
    const search = inject('search') as Ref<Record<string, unknown>>;
    const templates = inject('templates') as Ref<
      Array<Record<string, unknown>>
    >;

    const service = inject('service') as Ref<Partial<Service>>;

    const { getNotifications, notifications } = useNotifications(
      service.value.code as string
    );
    if (notificationType.value != service.value.code) {
      notificationType.value = service.value.code as string;
      getNotifications();
    }

    let timeout: unknown;
    watch(
      () => search.value.needle,
      (val) => {
        if (!val) {
          getTours();
          return;
        }
        clearTimeout(timeout as number);
        timeout = setTimeout(() => {
          getTours();
        }, 1000);
      }
    );

    watch(
      [() => search.value.from, () => search.value.to],
      ([newFrom, newTo]) => {
        fromDatePopup.value = toDatePopup.value = false;
        if (newFrom)
          fromDate.value = dayjs(newFrom as string).format('DD/MM/YYYY');
        if (newTo) toDate.value = dayjs(newTo as string).format('DD/MM/YYYY');
      }
    );

    watch([fromDate, toDate], ([newFrom, newTo]) => {
      if (!newFrom) {
        search.value.from = search.value.to = toDate.value = '';
        getTours();
      }
      if (!newTo) search.value.to = '';
    });

    watch(
      () => search.value.template,
      (val) => {
        if (!val) {
          getTours();
          return;
        }
      }
    );

    return {
      search,
      filter,
      fromDatePopup,
      fromDate,
      toDatePopup,
      toDate,
      notifications,
      templates,
      onSubmit: () => {
        console.log(search.value);
        getTours();
      },
      optionsFn(date: string) {
        return date >= dayjs().format('YYYY/MM/DD');
      },
      reset() {
        search.value = {
          service: 'htc',
          needle: '',
          from: '',
          to: '',
          notification: [] as number[],
          notificationComplete: null,
          template: null,
        };
        fromDate.value = toDate.value = '';
        getTours();
      },
      removeChip(id: number, index: number) {
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
        <div class="col-12 col-md-6 col-lg-4">
          <BaseSelect
            v-model="search.notification"
            :options="notifications"
            label="Notifications"
            option-label="name"
            option-value="_id"
            emit-value
            map-options
            autocomplete
            use-input
            multiple
            options-selected-class="text-deep-orange"
          >
            <template v-slot:selected-item="{opt, index}">
              <q-chip class="tw-mr-2" removable @remove="removeChip(opt._id, index)">
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
            v-model="search.template"
            :options="templates"
            label="Templates"
            option-label="name"
            option-value="_id"
            emit-value
            map-options
            autocomplete
            clearable
          >
            <template v-slot:selected-item="scope">
              <div class="row tw-w-full">
                <div
                  class="col"
                  :style="{maxWidth: '30px', height: '30px', backgroundColor: scope.opt.color}"
                ></div>

                <div class="col tw-flex tw-justify-between tw-items-center">
                  <label class="tw-ml-3" v-html="scope.opt.name"></label>
                  <label class="tw-text-sm tw-text-gray-400">{{ scope.opt.type }}</label>
                </div>
              </div>
            </template>
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" class="tw-flex tw-items-center">
                <q-section avatar>
                  <div :style="{width: '30px', height: '30px', backgroundColor: scope.opt.color}"></div>
                </q-section>
                <q-item-section class="tw-ml-3">
                  <q-item-label v-html="scope.opt.name" />
                  <q-item-label caption>{{ scope.opt.type }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </BaseSelect>
        </div>
      </div>

      <div class="row q-col-gutter-md tw-mt-3">
        <div class="col-12 col-md-6 col-lg-4 tw-flex tw-justify-end">
          <BaseButton v-if="filter" label="Search" type="submit" color="primary" class="q-ml-sm" />
        </div>
      </div>
    </div>
  </q-form>
</template>
