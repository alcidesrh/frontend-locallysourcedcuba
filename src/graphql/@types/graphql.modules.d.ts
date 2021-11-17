
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
    

declare module '*/booking.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const bookingFragment: DocumentNode;
export const createBookingMutation: DocumentNode;
export const updateBookingMutation: DocumentNode;
export const deleteBookingMutation: DocumentNode;

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
export const getGuidesQuery: DocumentNode;
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
export const housesQuery: DocumentNode;
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
    

declare module '*/itinerary.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const createItineraryTemplateMutation: DocumentNode;
export const updateItineraryTemplateMutation: DocumentNode;
export const deleteItineraryTemplateMutation: DocumentNode;
export const createItineraryDayTemplateMutation: DocumentNode;
export const updateItineraryDayTemplateMutation: DocumentNode;
export const createItineraryMutation: DocumentNode;
export const updateItineraryMutation: DocumentNode;
export const deleteItineraryMutation: DocumentNode;
export const createItineraryDayMutation: DocumentNode;
export const updateItineraryDayMutation: DocumentNode;

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
export const createNotificationTourMutation: DocumentNode;
export const updateNotificationTourMutation: DocumentNode;
export const deleteNotificationTourMutation: DocumentNode;

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
    

declare module '*/sleepingRequirement.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const createSleepingRequirementMutation: DocumentNode;
export const updateSleepingRequirementMutation: DocumentNode;
export const deleteSleepingRequirementMutation: DocumentNode;
export const createSleepingRequirementRoomTypeMutation: DocumentNode;
export const updateSleepingRequirementRoomTypeMutation: DocumentNode;
export const deleteSleepingRequirementRoomTypeMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/tour.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const basicListTourFragment: DocumentNode;
export const htcTourFragment: DocumentNode;
export const listTourQuery: DocumentNode;
export const getTourQuery: DocumentNode;
export const createTourMutation: DocumentNode;
export const updateHtcTourMutation: DocumentNode;
export const deleteTourMutation: DocumentNode;
export const lsTourFragment: DocumentNode;
export const listLsTourQuery: DocumentNode;
export const getLsTourQuery: DocumentNode;
export const createLsTourMutation: DocumentNode;
export const updateLsTourMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/tourTemplate.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const basicHtcTourTemplateFragment: DocumentNode;
export const htcTourTemplateFragment: DocumentNode;
export const listHtcTourTemplateQuery: DocumentNode;
export const getTourTemplateQuery: DocumentNode;
export const createTourTemplateMutation: DocumentNode;
export const updateHtcTourTemplateMutation: DocumentNode;
export const deleteTourTemplateMutation: DocumentNode;
export const basicLsTourTemplateFragment: DocumentNode;
export const lsTourTemplateFragment: DocumentNode;
export const listLsTourTemplateQuery: DocumentNode;
export const getLsTourTemplateQuery: DocumentNode;
export const createLsTourTemplateMutation: DocumentNode;
export const updateLsTourTemplateMutation: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/transportation.graphql' {
  import { DocumentNode } from 'graphql';
  const defaultDocument: DocumentNode;
  export const transportationFragment: DocumentNode;
export const getTransportationsQuery: DocumentNode;
export const getTransportationsSelectQuery: DocumentNode;
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
    