import { RouteRecordRaw } from 'vue-router';
import { h, resolveComponent } from 'vue';
import loadView from '../helpers/importComponents';

const routes: RouteRecordRaw[] = [
  {
    path: 'houses',
    name: 'TabHouse',
    component: () => loadView('house/TabHouse'),
    meta: { active: 'house' },
    children: [
      {
        path: '',
        component: {
          render: () => h(resolveComponent('router-view')),
        },

        children: [
          {
            path: '',
            name: 'ListHouse',
            component: () => loadView('house/ListHouse'),
          },
          {
            path: 'create',
            name: 'CreateHouse',
            component: () => loadView('house/CreateHouse'),
          },
          {
            path: 'edit/:id',
            name: 'EditHouse',
            component: () => loadView('house/EditHouse'),
          },
        ],
      },
      {
        path: 'type',
        name: 'ListHouseType',
        component: () => loadView('house/ListHouseType'),
      },
      {
        path: 'room',
        name: 'ListHouseRoomType',
        component: () => loadView('house/ListHouseRoomType'),
      },
      {
        path: 'feature',
        name: 'ListHouseFeature',
        component: () => loadView('house/ListHouseFeature'),
      },
    ],
  },
];

export default routes;
