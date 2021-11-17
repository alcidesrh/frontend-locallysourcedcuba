import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/htc-tour',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'htc-tour' },
    children: [
      {
        path: '',
        name: 'ListHtcTour',
        component: () => loadView('tour/htc/ListHtcTour'),
      },
      {
        path: 'create',
        name: 'CreateHtcTour',
        component: () => loadView('tour/htc/CreateHtcTour'),
      },
      {
        path: 'edit/:id',
        name: 'EditHtcTour',
        component: () => loadView('tour/htc/EditHtcTour'),
      },
    ],
  },
  {
    path: '/ls-tour',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'ls-tour' },
    children: [
      {
        path: '',
        name: 'ListLsTour',
        component: () => loadView('tour/ls/ListLsTour'),
      },
      {
        path: 'create',
        name: 'CreateLsTour',
        component: () => loadView('tour/ls/CreateLsTour'),
      },
      {
        path: 'edit/:id',
        name: 'EditLsTour',
        component: () => loadView('tour/ls/EditLsTour'),
      },
    ],
  },
];

export default routes;
