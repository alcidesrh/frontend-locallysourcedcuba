
declare module '*/activity.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const activityFragment: DocumentNode;
export const getActivityQuery: DocumentNode;
export const listActivityQuery: DocumentNode;
export const createActivityMutation: DocumentNode;
export const updateActivityMutation: DocumentNode;
export const deleteActivityMutation: DocumentNode;
export const createActivityComboMutation: DocumentNode;
export const priorityActivityComboMutation: DocumentNode;
export const deleteActivityComboMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/destination.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const destinationsQuery: DocumentNode;
export const listDestinationQuery: DocumentNode;
export const getDestinationQuery: DocumentNode;
export const createDestinationMutation: DocumentNode;
export const updateDestinationMutation: DocumentNode;
export const deleteDestinationMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/driver.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getDriverQuery: DocumentNode;
export const getDriversQuery: DocumentNode;
export const listDriverQuery: DocumentNode;
export const createDriverMutation: DocumentNode;
export const updateDriverMutation: DocumentNode;
export const deleteDriverMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/guide.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getGuideQuery: DocumentNode;
export const listGuideQuery: DocumentNode;
export const createGuideMutation: DocumentNode;
export const updateGuideMutation: DocumentNode;
export const deleteGuideMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/house.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const houseRoomFragment: DocumentNode;
export const houseFragment: DocumentNode;
export const getHouseQuery: DocumentNode;
export const listHouseQuery: DocumentNode;
export const createHouseMutation: DocumentNode;
export const updateHouseMutation: DocumentNode;
export const deleteHouseMutation: DocumentNode;
export const listHouseTypeQuery: DocumentNode;
export const deleteHouseTypeMutation: DocumentNode;
export const createHouseTypeMutation: DocumentNode;
export const updateHouseTypeMutation: DocumentNode;
export const listHouseRoomTypeQuery: DocumentNode;
export const deleteHouseRoomTypeMutation: DocumentNode;
export const createHouseRoomTypeMutation: DocumentNode;
export const updateHouseRoomTypeMutation: DocumentNode;
export const listHouseFeatureQuery: DocumentNode;
export const deleteHouseFeatureMutation: DocumentNode;
export const createHouseFeatureMutation: DocumentNode;
export const updateHouseFeatureMutation: DocumentNode;
export const createHouseRoomMutation: DocumentNode;
export const updateHouseRoomMutation: DocumentNode;
export const deleteHouseRoomMutation: DocumentNode;
export const createHouseSeasonMutation: DocumentNode;
export const createHouseSeasonRoomMutation: DocumentNode;
export const updateHouseSeasonRoomMutation: DocumentNode;
export const deleteHouseSeasonMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/location.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const locationFragment: DocumentNode;
export const locationDistanceFragment: DocumentNode;
export const getLocationsQuery: DocumentNode;
export const getLocationQuery: DocumentNode;
export const getLocationDistanceQuery: DocumentNode;
export const listLocationQuery: DocumentNode;
export const listLocationDistanceQuery: DocumentNode;
export const createLocationMutation: DocumentNode;
export const createLocationDistanceMutation: DocumentNode;
export const updateLocationMutation: DocumentNode;
export const updateLocationDistanceMutation: DocumentNode;
export const deleteLocationMutation: DocumentNode;
export const deleteLocationDistanceMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/notification.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const getNotificationQuery: DocumentNode;
export const getNotificationsQuery: DocumentNode;
export const listNotificationQuery: DocumentNode;
export const createNotificationMutation: DocumentNode;
export const updateNotificationMutation: DocumentNode;
export const priorityNotificationMutation: DocumentNode;
export const deleteNotificationMutation: DocumentNode;
export const createNotificationTourTemplateMutation: DocumentNode;
export const updateNotificationTourTemplateMutation: DocumentNode;
export const deleteNotificationTourTemplateMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/province.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const listQuery: DocumentNode;
export const getItemQuery: DocumentNode;
export const createMutation: DocumentNode;
export const updateMutation: DocumentNode;
export const deleteMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/service.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const listServiceQuery: DocumentNode;
export const getServiceQuery: DocumentNode;
export const createServiceMutation: DocumentNode;
export const updateServiceMutation: DocumentNode;
export const deleteServiceMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/tourTemplate.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const htcTourTemplateFragment: DocumentNode;
export const listHtcTourTemplateQuery: DocumentNode;
export const getTourTemplateQuery: DocumentNode;
export const createTourTemplateMutation: DocumentNode;
export const updateHtcTourTemplateMutation: DocumentNode;
export const deleteTourTemplateMutation: DocumentNode;
export const lsTourTemplateFragment: DocumentNode;
export const listLsTourTemplateQuery: DocumentNode;
export const updateLsTourTemplateMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/transportation.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const transportationFragment: DocumentNode;
export const getTransportationsQuery: DocumentNode;
export const getTransportationQuery: DocumentNode;
export const createTransportationMutation: DocumentNode;
export const createTransportationPriceMutation: DocumentNode;
export const createTransportationRouteMutation: DocumentNode;
export const updateTransportationMutation: DocumentNode;
export const updateTransportationPriceMutation: DocumentNode;
export const updateTransportationRouteMutation: DocumentNode;
export const deleteTransportationMutation: DocumentNode;
export const deleteTransportationPriceMutation: DocumentNode;
export const deleteTransportationRouteMutation: DocumentNode;

  export default defaultDocument;
}
    