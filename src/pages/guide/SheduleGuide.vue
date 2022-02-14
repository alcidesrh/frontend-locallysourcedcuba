<script lang="ts">
import { Guide } from 'src/graphql/@types/types';
import { defineComponent, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMutation } from '@vue/apollo-composable';
import {
  deleteGuideMutation,
  listGuideQuery,
} from 'src/graphql/query/guide.graphql';
import { error, success } from 'src/helpers/notification';
import { useQuasar } from 'quasar';
import useGuide from 'src/pages/guide/guideService';
import dayjs from 'dayjs';
import { cloneDeep } from '@apollo/client/utilities';

export default defineComponent({
  setup() {
    let { getGuides, guides } = useGuide(),
      date = ref(dayjs());
    if (!guides.value.length) getGuides();

    return {
      guides,
      days: computed(() => {
        return Array.from({ length: 30 }, (_, i) =>
          dayjs(date.value).add(i, 'day').format('DD')
        );
      }),
      next: () => {
        date.value = dayjs(date.value).add(29, 'day');
      },
    };
  },
});
</script>

<template>
  <q-page padding>
    <q-card class="tw-mt-0 tw-flex tw-items-center tw-p-5">
      <div class="row tw-w-full">
        <div class="col-12 tw-flex tw-items-center tw-justify-between tw-mb-5 tw-md-0">
          <BaseButton round icon="add" type="button" color="primary" class="q-ml-sm" @click="next" />
        </div>
      </div>
    </q-card>
    <div class="tw-overflow-auto tw-flex" style="width: 1050px;">
      <div style="line-height: 0px; width: 150px;">
        <div
          class="cell-guide first-row tw-w-full tw-flex tw-justify-center tw-items-center tw-truncate"
        >Guides</div>
        <div
          v-for="g in guides"
          :key="g.id"
          class="cell-guide tw-w-full tw-flex tw-justify-center tw-items-center tw-truncate tw-font-bold"
          v-text="g.name"
        ></div>
      </div>
      <div style="line-height: 0px; width: 900px; position: relative;">
        <div
          style="position: absolute; height: 25px; width: 90px; background-color: hotpink; top: 75px; left: 300px"
        ></div>
        <div v-for="e,i in days" :key="i" class="cell first-row tw-inline-block">
          <div class="tw-flex tw-justify-center tw-items-center tw-h-full" v-text="e"></div>
        </div>
        <div v-for="g in guides.length" :key="g">
          <div v-for="e in 30" :key="e" class="cell tw-inline-block"></div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<style scoped>
.cell {
  border-top: 1px solid grey;
  border-right: 1px solid grey;
}
.cell-guide {
  border: 1px solid grey;
  border-bottom: 0px;
}
.cell,
.cell-guide {
  width: 30px;
  height: 25px;
}
.cell-guide {
  width: 100%;
}
.first-row {
  border-top: 0px;
  font-weight: bold;
  color: grey;
}
</style>
