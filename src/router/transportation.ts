import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/transportations',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'transportation' },
    children: [
      {
        path: '',
        name: 'ListTransportation',
        component: () => loadView('transportation/ListTransportation'),
      },
      {
        path: 'create',
        name: 'CreateTransportation',
        component: () => loadView('transportation/CreateTransportation'),
      },
      {
        path: 'edit/:id',
        name: 'EditTransportation',
        component: () => loadView('transportation/EditTransportation'),
      },
    ],
  },
];

export default routes;
