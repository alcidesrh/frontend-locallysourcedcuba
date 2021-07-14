import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: 'activities',
    name: 'TabActivity',
    component: () => loadView('activity/TabActivity'),
    meta: { active: 'activity' },
    children: [
      {
        path: '',
        component: {
          render: () => h(resolveComponent('router-view')),
        },

        children: [
          {
            path: '',
            name: 'ListActivityNormal',
            component: () => loadView('activity/normal/ListActivityNormal'),
          },
          {
            path: 'create',
            name: 'CreateActivityNormal',
            component: () => loadView('activity/normal/CreateActivityNormal'),
          },
          {
            path: 'edit/:id',
            name: 'EditActivityNormal',
            component: () => loadView('activity/normal/EditActivityNormal'),
          },
        ],
      },
      {
        path: 'transport',
        name: 'ActivityTransport',
        component: {
          render: () => h(resolveComponent('router-view')),
        },
        children: [
          {
            path: '',
            name: 'ListActivityTransport',
            component: () =>
              loadView('activity/transport/ListActivityTransport'),
          },
          {
            path: 'create',
            name: 'CreateActivityTransport',
            component: () =>
              loadView('activity/transport/CreateActivityTransport'),
          },
          {
            path: 'edit/:id',
            name: 'EditActivityTransport',
            component: () =>
              loadView('activity/transport/EditActivityTransport'),
          },
        ],
      },
      {
        path: 'combo',
        name: 'ActivityCombo',
        component: {
          render: () => h(resolveComponent('router-view')),
        },
        children: [
          {
            path: '',
            name: 'ListActivityCombo',
            component: () => loadView('activity/combo/ListActivityCombo'),
          },
          {
            path: 'create',
            name: 'CreateActivityCombo',
            component: () => loadView('activity/combo/CreateActivityCombo'),
          },
          {
            path: 'edit/:id',
            name: 'EditActivityCombo',
            component: () => loadView('activity/combo/EditActivityCombo'),
          },
        ],
      },
    ],
  },
];

export default routes;
