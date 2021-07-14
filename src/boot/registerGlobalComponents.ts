/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { boot } from 'quasar/wrappers';
import { registerBaseComponents } from 'src/helpers/registerBaseComponents'


export default boot(({ app }) => {
  registerBaseComponents(app)
});
