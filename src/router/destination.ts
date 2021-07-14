import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/destinations',
    component: {
      render: () => h(resolveComponent('router-view'))
    },
    meta: { active: 'destination' },
    children: [
      {
        path: '',
        name: 'ListDestination',
        component: () => loadView('destination/ListDestination')
      },
      {
        path: 'create',
        name: 'CreateDestination',
        component: () => loadView('destination/CreateDestination'),
      },
      {
        path: 'edit/:id',
        name: 'EditDestination',
        component: () => loadView('destination/EditDestination'),
      },
    ],
  },
];

export default routes;
