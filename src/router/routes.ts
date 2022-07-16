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
import transferRoutes from './transfer';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('src/pages/Layout.vue'),
    children: [
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
      ...transferRoutes,
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
