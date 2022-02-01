import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/services',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'service' },
    children: [
      {
        path: '',
        name: 'ListService',
        component: () => loadView('service/ListService'),
      },
      {
        path: 'create',
        name: 'CreateService',
        component: () => loadView('service/CreateService'),
      },
      {
        path: 'edit/:id',
        name: 'EditService',
        component: () => loadView('service/EditService'),
      },
    ],
  },
];

export default routes;
