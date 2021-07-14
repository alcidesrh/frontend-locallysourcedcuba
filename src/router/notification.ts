import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: '/notifications',
    component: {
      render: () => h(resolveComponent('router-view'))
    },
    meta: { active: 'notification' },
    children: [
      {
        path: '',
        name: 'ListNotification',
        component: () => loadView('notification/ListNotification')
      },
      {
        path: 'create',
        name: 'CreateNotification',
        component: () => loadView('notification/CreateNotification'),
      },
      {
        path: 'edit/:id',
        name: 'EditNotification',
        component: () => loadView('notification/EditNotification'),
      },
    ],
  },
];

export default routes;
