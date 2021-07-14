import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/location-distance',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'location-distance' },
    children: [
      {
        path: '',
        name: 'ListLocationDistance',
        component: () => loadView('location/distance/ListLocationDistance'),
      },
      {
        path: 'create',
        name: 'CreateLocationDistance',
        component: () => loadView('location/distance/CreateLocationDistance'),
      },
      {
        path: 'edit/:id',
        name: 'EditLocationDistance',
        component: () => loadView('location/distance/EditLocationDistance'),
      },
    ],
  },
];

export default routes;
