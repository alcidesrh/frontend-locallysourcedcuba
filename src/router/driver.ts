import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/drivers',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'driver' },
    children: [
      {
        path: '',
        name: 'ListDriver',
        component: () => loadView('driver/ListDriver'),
      },
      {
        path: 'create',
        name: 'CreateDriver',
        component: () => loadView('driver/CreateDriver'),
      },
      {
        path: 'edit/:id',
        name: 'EditDriver',
        component: () => loadView('driver/EditDriver'),
      },
    ],
  },
];

export default routes;
