import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/htc-tour-templates',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'htc-tour-templates' },
    children: [
      {
        path: '',
        name: 'ListHtcTourTemplate',
        component: () => loadView('tour/template/htc/ListHtcTourTemplate'),
      },
      {
        path: 'create',
        name: 'CreateHtcTourTemplate',
        component: () => loadView('tour/template/htc/CreateHtcTourTemplate'),
      },
      {
        path: 'edit/:id',
        name: 'EditHtcTourTemplate',
        component: () => loadView('tour/template/htc/EditHtcTourTemplate'),
      },
    ],
  },
  {
    path: '/ls-tour-templates',
    component: {
      render: () => h(resolveComponent('router-view')),
    },
    meta: { active: 'ls-tour-templates' },
    children: [
      {
        path: '',
        name: 'ListLsTourTemplate',
        component: () => loadView('tour/template/ls/ListLsTourTemplate'),
      },
      {
        path: 'create',
        name: 'CreateLsTourTemplate',
        component: () => loadView('tour/template/ls/CreateLsTourTemplate'),
      },
      {
        path: 'edit/:id',
        name: 'EditLsTourTemplate',
        component: () => loadView('tour/template/ls/EditLsTourTemplate'),
      },
    ],
  },
];

export default routes;
