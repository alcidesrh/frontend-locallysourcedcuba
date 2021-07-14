import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/locations',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'location' },
    children: [
      {
        path: '',
        name: 'ListLocation',
        component: () => loadView('location/ListLocation'),
      },
      {
        path: 'create',
        name: 'CreateLocation',
        component: () => loadView('location/CreateLocation'),
      },
      {
        path: 'edit/:id',
        name: 'EditLocation',
        component: () => loadView('location/EditLocation'),
      },
    ],
  },
];

export default routes;
