import { default as dayjs } from 'dayjs';

export const format = (date: string | undefined) =>
  !date || dayjs(date).format('DD-MM-YYYY');
