import { RouteRecordRaw } from 'vue-router';

import guideRoutes from './notification';
import provinceRoutes from './province';
import destinationRoutes from './destination';
import serviceRoutes from './service';
import notificationRoutes from './guide';
import driverRoutes from './driver';
import houseRoutes from './house';
import activityRoutes from './activity';
import locationRoutes from './location';
import locationDistanceRoutes from './locationDistance';
import transportationRoutes from './transportation';
import tourTemplateRoutes from './tourTemplate';
import tourRoutes from './tour';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/Content.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/Index.vue'),
      },
      ...guideRoutes,
      ...provinceRoutes,
      ...destinationRoutes,
      ...serviceRoutes,
      ...notificationRoutes,
      ...driverRoutes,
      ...houseRoutes,
      ...activityRoutes,
      ...locationRoutes,
      ...locationDistanceRoutes,
      ...transportationRoutes,
      ...tourTemplateRoutes,
      ...tourRoutes,
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
