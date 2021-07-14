import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/guides',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'guide' },
    children: [
      {
        path: '',
        name: 'ListGuide',
        component: () => loadView('guide/ListGuide'),
      },
      {
        path: 'create',
        name: 'CreateGuide',
        component: () => loadView('guide/CreateGuide'),
      },
      {
        path: 'edit/:id',
        name: 'EditGuide',
        component: () => loadView('guide/EditGuide'),
      },
    ],
  },
];

export default routes;
