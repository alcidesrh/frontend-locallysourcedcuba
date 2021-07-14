<script lang="ts">
import { defineComponent } from 'vue';
import { requireRule } from '../../helpers/validation';

export default defineComponent({
  setup(props, { attrs }) {
    let rule: unknown,
      multiple = false;
    if (typeof attrs.validate != 'undefined') {
      rule = requireRule;
    }
    if (typeof attrs.multiple != 'undefined') multiple = true;
    return { rule, multiple };
  },
});
</script>

<template>
  <q-select v-bind="$attrs" outlined lazy-rules :rules="rule" hide-bottom-space>
    <template v-if="multiple" v-slot:option="{ itemProps, opt, selected, toggleOption }">
      <q-item v-bind="itemProps">
        <div class="row">
          <div class="col tw-flex tw-items-center">
            <q-checkbox :model-value="selected" @update:model-value="toggleOption(opt)" />
            <q-item-label v-html="opt.name"></q-item-label>
          </div>
        </div>
      </q-item>
    </template>
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-select>
</template>