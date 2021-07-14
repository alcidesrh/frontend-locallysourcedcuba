
<template>
  <q-checkbox v-bind="$attrs">
    <template v-for="(_, slot) of $slots" v-slot:[slot]="scope">
      <slot :name="slot" v-bind="scope" />
    </template>
  </q-checkbox>
</template>