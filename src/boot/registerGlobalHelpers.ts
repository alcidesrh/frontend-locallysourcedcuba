/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { boot } from 'quasar/wrappers';
import dayjs from 'dayjs';

export default boot(({ app }) => {
  app.config.globalProperties.$helper = {
    formatDate(value: string) {
      return dayjs(value).format('DD/MM/YYYY');
    },
  };
});
