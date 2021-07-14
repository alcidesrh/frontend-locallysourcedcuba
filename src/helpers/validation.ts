export const requireRule = [
  (val: string | number) =>
    ((val || val === 0) &&
      (typeof val == 'number' ||
        (typeof val == 'string' && val.length > 0) ||
        typeof val == 'object')) ||
    'This field is required',
];
export const requireEmail = [
  ...requireRule,
  (val: string) => /.+@.+\..+/.test(val) || 'The email is invalid',
];
