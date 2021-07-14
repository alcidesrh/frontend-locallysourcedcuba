<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  setup(props, { emit }) {
    const useSearch: Partial<Record<string, unknown>> = { showSearch: false };

    if (typeof props.search != 'undefined') {
      useSearch.showSearch = true;
      const searchValue = ref('');
      searchValue.value = props.search as string;
      useSearch.searchValue = searchValue;

      watch(searchValue, (val) => {
        emit('update:search', val);
      });
    }

    return { ...useSearch };
  },
  emits: ['update:search'],
  props: ['title', 'createRoute', 'search'],
});
</script>

<template>
  <q-table v-bind="$attrs" :title="title" color="primary" row-key="name">
    <template v-slot:top v-if="title || createRoute || showSearch">
      <label class="text-h6" v-if="title">{{title}}</label>
      <BaseButton
        v-if="createRoute"
        class="q-ml-md tw-absolute sm:tw-relative tw-top-0 tw-right-0 tw-mt-2 tw-mr-2 sm:tw-mt-0 sm:tw-mr-0"
        round
        color="primary"
        icon="add"
        @click="$router.push({name: createRoute})"
      />
      <q-space v-if="showSearch" />
      <div v-if="showSearch" class="flex justify-end tw-w-full tw-mt-5 sm:tw-mt-0 sm:tw-w-auto">
        <BaseInput label="Search" v-model="searchValue" clearable class="tw-w-full sm:tw-w-auto">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </BaseInput>
      </div>
    </template>
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-table>
</template>