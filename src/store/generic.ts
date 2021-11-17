import { ref } from 'vue';

const generic = ref<
  | null
  | string
  | number
  | boolean
  | Record<string, unknown>
  | Array<null | string | number | boolean | Record<string, unknown>>
>(null);

export default generic;
