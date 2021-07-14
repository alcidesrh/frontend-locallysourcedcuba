<script lang="ts">
import { defineComponent, computed } from 'vue';
import useHtcTourTemplate from 'src/pages/tour/template/htc/htcTourTemplateService';

export default defineComponent({
  setup() {
    let { item, items, list } = useHtcTourTemplate();

    if (typeof item.value.description == 'undefined')
      item.value.description = null;

    if (!items.value.length) {
      list();
    }

    return {
      item,
      items,
      tourSelect1: computed(() =>
        items.value.filter(
          (e) => e.id != item.value.id && e.id != item.value?.template2?.id
        )
      ),
      tourSelect2: computed(() =>
        items.value.filter(
          (e) => e.id != item.value.id && e.id != item.value?.template1?.id
        )
      ),
    };
  },
  props: ['loading'],
  emits: ['submit'],
  methods: {
    onSubmit() {
      this.$emit('submit');
    },
  },
});
</script>

<template >
  <q-form @submit="onSubmit" class="q-mt-md">
    <div class="row q-col-gutter-md">
      <div class="col-6 col-md-2">
        <BaseSelect
          v-model="item.type"
          :options="['Group', 'Private', 'Tailor Made', 'Mixed']"
          label="Type"
          option-label="name"
          option-value="id"
          emit-value
          map-options
          validate
        ></BaseSelect>
      </div>
      <div class="col-6 col-md-2">
        <BaseInput v-model="item.code" label="Code" validate></BaseInput>
      </div>
      <div class="col-4 col-sm-4 col-md-2">
        <BaseInput v-model="item.color" label="Color" validate readonly>
          <template v-slot:append>
            <q-icon name="colorize" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-color v-model="item.color" />
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:prepend>
            <span
              class="tw-cursor-pointer"
              :style="{backgroundColor: item.color, width: '20px', height: '20px'}"
            >
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-color v-model="item.color" />
              </q-popup-proxy>
            </span>
          </template>
        </BaseInput>
      </div>
      <div class="col-8 col-md-6">
        <BaseInput v-model="item.name" label="Name" validate></BaseInput>
      </div>
      <div class="col-12 col-md-6" v-if="item.type == 'Mixed'">
        <BaseSelect
          v-model="item.template1"
          :options="tourSelect1"
          label="Template 1"
          option-label="name"
          validate
        >
          <template v-slot:selected-item="scope">
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
      <div class="col-12 col-md-6" v-if="item.type == 'Mixed'">
        <BaseSelect
          v-model="item.template2"
          :options="tourSelect2"
          label="Template 2"
          option-label="name"
          validate
        >
          <template v-slot:selected-item="scope">
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
      <slot></slot>
      <div class="col-12 tw-mt-3">
        <p class="tw-text-lg tw-mb-3">Extra Information</p>
        <BaseEditor v-model="item.description"></BaseEditor>
      </div>
      <div class="col-12 tw-text-right">
        <BaseButton label="Save" type="submit" color="primary" class="q-ml-sm" :loading="loading" />
      </div>
    </div>
  </q-form>
</template>
