import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/transfers',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'transfers' },
    children: [
      {
        path: '',
        name: 'LisTransfer',
        component: () => loadView('transfer/ListTransfer'),
      },
    ],
  },
];

export default routes;
