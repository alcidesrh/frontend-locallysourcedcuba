<script lang="ts">
import { defineComponent } from 'vue';
import { requireRule, requireEmail } from '../../helpers/validation';

export default defineComponent({
  setup(props) {
    let rule: unknown;
    if (typeof props.validate != 'undefined') {
      if (props.validate == 'email') rule = requireEmail;
      else rule = requireRule;
    }
    return { rule };
  },
  props: ['validate'],
});
</script>

<template>
  <q-input v-bind="$attrs" outlined lazy-rules :rules="rule" hide-bottom-space>
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-input>
</template>