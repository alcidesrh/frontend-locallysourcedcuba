import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/provinces',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'province' },
    children: [
      {
        path: '',
        name: 'ListProvince',
        component: () => loadView('province/ListProvince'),
      },
      {
        path: 'create',
        name: 'CreateProvince',
        component: () => loadView('province/CreateProvince'),
      },
      {
        path: 'edit/:id',
        name: 'EditProvince',
        component: () => loadView('province/EditProvince'),
      },
    ],
  },
];

export default routes;
