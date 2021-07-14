export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Activity = Node & {
  __typename?: 'Activity';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  destination?: Maybe<Destination>;
  personCost?: Maybe<Scalars['Int']>;
  guideCost?: Maybe<Scalars['Int']>;
  carCost?: Maybe<Scalars['Int']>;
  personPerCar?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  activities?: Maybe<Array<Maybe<ActivityCombo>>>;
};

export type ActivityCombo = Node & {
  __typename?: 'ActivityCombo';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  priority?: Maybe<Scalars['Int']>;
  activity: Activity;
  parent: Activity;
};

export type ActivityFilter_Order = {
  name?: Maybe<Scalars['String']>;
};

export type Destination = Node & {
  __typename?: 'Destination';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  province: Province;
  houses?: Maybe<HouseConnection>;
  activities?: Maybe<Array<Maybe<Activity>>>;
};


export type DestinationHousesArgs = {
  page?: Maybe<Scalars['Int']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  order?: Maybe<Array<Maybe<HouseFilter_Order>>>;
};


export type DestinationActivitiesArgs = {
  order?: Maybe<Array<Maybe<ActivityFilter_Order>>>;
};

/** Connection for Destination. */
export type DestinationConnection = {
  __typename?: 'DestinationConnection';
  collection?: Maybe<Array<Maybe<Destination>>>;
  paginationInfo: DestinationPaginationInfo;
};

export type DestinationFilter_Order = {
  name?: Maybe<Scalars['String']>;
};

/** Information about the pagination. */
export type DestinationPaginationInfo = {
  __typename?: 'DestinationPaginationInfo';
  itemsPerPage: Scalars['Int'];
  lastPage: Scalars['Int'];
  totalCount: Scalars['Int'];
};

export type Driver = Node & {
  __typename?: 'Driver';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  pax?: Maybe<Scalars['Int']>;
  transportations?: Maybe<Array<Maybe<Transportation>>>;
};

/** Connection for Driver. */
export type DriverConnection = {
  __typename?: 'DriverConnection';
  collection?: Maybe<Array<Maybe<Driver>>>;
  paginationInfo: DriverPaginationInfo;
};

export type DriverFilter_Order = {
  name?: Maybe<Scalars['String']>;
};

/** Information about the pagination. */
export type DriverPaginationInfo = {
  __typename?: 'DriverPaginationInfo';
  itemsPerPage: Scalars['Int'];
  lastPage: Scalars['Int'];
  totalCount: Scalars['Int'];
};

export type Guide = Node & {
  __typename?: 'Guide';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  bonus?: Maybe<Scalars['Int']>;
};

/** Connection for Guide. */
export type GuideConnection = {
  __typename?: 'GuideConnection';
  collection?: Maybe<Array<Maybe<Guide>>>;
  paginationInfo: GuidePaginationInfo;
};

export type GuideFilter_Order = {
  name?: Maybe<Scalars['String']>;
};

/** Information about the pagination. */
export type GuidePaginationInfo = {
  __typename?: 'GuidePaginationInfo';
  itemsPerPage: Scalars['Int'];
  lastPage: Scalars['Int'];
  totalCount: Scalars['Int'];
};

export type House = Node & {
  __typename?: 'House';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<HouseType>;
  features?: Maybe<Array<Maybe<HouseFeature>>>;
  rooms?: Maybe<Array<Maybe<HouseRoom>>>;
  houseSeasons?: Maybe<Array<Maybe<HouseSeason>>>;
  destination?: Maybe<Destination>;
};

/** Connection for House. */
export type HouseConnection = {
  __typename?: 'HouseConnection';
  collection?: Maybe<Array<Maybe<House>>>;
  paginationInfo: HousePaginationInfo;
};

export type HouseFeature = Node & {
  __typename?: 'HouseFeature';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  houses?: Maybe<Array<Maybe<House>>>;
};


export type HouseFeatureHousesArgs = {
  order?: Maybe<Array<Maybe<HouseFilter_Order>>>;
};

export type HouseFilter_Order = {
  name?: Maybe<Scalars['String']>;
};

/** Information about the pagination. */
export type HousePaginationInfo = {
  __typename?: 'HousePaginationInfo';
  itemsPerPage: Scalars['Int'];
  lastPage: Scalars['Int'];
  totalCount: Scalars['Int'];
};

export type HouseRoom = Node & {
  __typename?: 'HouseRoom';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  price?: Maybe<Scalars['Int']>;
  roomType: HouseRoomType;
  house?: Maybe<House>;
  houseSeasonRooms?: Maybe<Array<Maybe<HouseSeasonRoom>>>;
};

export type HouseRoomType = Node & {
  __typename?: 'HouseRoomType';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  houseRooms?: Maybe<Array<Maybe<HouseRoom>>>;
};

export type HouseSeason = Node & {
  __typename?: 'HouseSeason';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  startDate: Scalars['String'];
  endDate: Scalars['String'];
  seasonRooms?: Maybe<Array<Maybe<HouseSeasonRoom>>>;
  house: House;
};

export type HouseSeasonRoom = Node & {
  __typename?: 'HouseSeasonRoom';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  price?: Maybe<Scalars['Int']>;
  room: HouseRoom;
  houseSeason: HouseSeason;
};

export type HouseType = Node & {
  __typename?: 'HouseType';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  houses?: Maybe<Array<Maybe<House>>>;
};


export type HouseTypeHousesArgs = {
  order?: Maybe<Array<Maybe<HouseFilter_Order>>>;
};

export type Location = Node & {
  __typename?: 'Location';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
};

/** Connection for Location. */
export type LocationConnection = {
  __typename?: 'LocationConnection';
  collection?: Maybe<Array<Maybe<Location>>>;
  paginationInfo: LocationPaginationInfo;
};

export type LocationDistance = Node & {
  __typename?: 'LocationDistance';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  location1: Location;
  location2: Location;
  kms: Scalars['Int'];
};

/** Connection for LocationDistance. */
export type LocationDistanceConnection = {
  __typename?: 'LocationDistanceConnection';
  collection?: Maybe<Array<Maybe<LocationDistance>>>;
  paginationInfo: LocationDistancePaginationInfo;
};

/** Information about the pagination. */
export type LocationDistancePaginationInfo = {
  __typename?: 'LocationDistancePaginationInfo';
  itemsPerPage: Scalars['Int'];
  lastPage: Scalars['Int'];
  totalCount: Scalars['Int'];
};

export type LocationFilter_Order = {
  name?: Maybe<Scalars['String']>;
};

/** Information about the pagination. */
export type LocationPaginationInfo = {
  __typename?: 'LocationPaginationInfo';
  itemsPerPage: Scalars['Int'];
  lastPage: Scalars['Int'];
  totalCount: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a ActivityCombo. */
  createActivityCombo?: Maybe<CreateActivityComboPayload>;
  /** Prioritys a ActivityCombo. */
  priorityActivityCombo?: Maybe<PriorityActivityComboPayload>;
  /** Updates a ActivityCombo. */
  updateActivityCombo?: Maybe<UpdateActivityComboPayload>;
  /** Deletes a ActivityCombo. */
  deleteActivityCombo?: Maybe<DeleteActivityComboPayload>;
  /** Deletes a TourTemplate. */
  deleteTourTemplate?: Maybe<DeleteTourTemplatePayload>;
  /** Updates a TourTemplate. */
  updateTourTemplate?: Maybe<UpdateTourTemplatePayload>;
  /** Creates a TourTemplate. */
  createTourTemplate?: Maybe<CreateTourTemplatePayload>;
  /** Deletes a HouseRoomType. */
  deleteHouseRoomType?: Maybe<DeleteHouseRoomTypePayload>;
  /** Updates a HouseRoomType. */
  updateHouseRoomType?: Maybe<UpdateHouseRoomTypePayload>;
  /** Creates a HouseRoomType. */
  createHouseRoomType?: Maybe<CreateHouseRoomTypePayload>;
  /** Deletes a TransportationPrice. */
  deleteTransportationPrice?: Maybe<DeleteTransportationPricePayload>;
  /** Updates a TransportationPrice. */
  updateTransportationPrice?: Maybe<UpdateTransportationPricePayload>;
  /** Creates a TransportationPrice. */
  createTransportationPrice?: Maybe<CreateTransportationPricePayload>;
  /** Deletes a Transportation. */
  deleteTransportation?: Maybe<DeleteTransportationPayload>;
  /** Updates a Transportation. */
  updateTransportation?: Maybe<UpdateTransportationPayload>;
  /** Creates a Transportation. */
  createTransportation?: Maybe<CreateTransportationPayload>;
  /** Creates a Driver. */
  createDriver?: Maybe<CreateDriverPayload>;
  /** Updates a Driver. */
  updateDriver?: Maybe<UpdateDriverPayload>;
  /** Deletes a Driver. */
  deleteDriver?: Maybe<DeleteDriverPayload>;
  /** Creates a Activity. */
  createActivity?: Maybe<CreateActivityPayload>;
  /** Updates a Activity. */
  updateActivity?: Maybe<UpdateActivityPayload>;
  /** Deletes a Activity. */
  deleteActivity?: Maybe<DeleteActivityPayload>;
  /** Deletes a Service. */
  deleteService?: Maybe<DeleteServicePayload>;
  /** Updates a Service. */
  updateService?: Maybe<UpdateServicePayload>;
  /** Creates a Service. */
  createService?: Maybe<CreateServicePayload>;
  /** Creates a LocationDistance. */
  createLocationDistance?: Maybe<CreateLocationDistancePayload>;
  /** Updates a LocationDistance. */
  updateLocationDistance?: Maybe<UpdateLocationDistancePayload>;
  /** Deletes a LocationDistance. */
  deleteLocationDistance?: Maybe<DeleteLocationDistancePayload>;
  /** Creates a House. */
  createHouse?: Maybe<CreateHousePayload>;
  /** Updates a House. */
  updateHouse?: Maybe<UpdateHousePayload>;
  /** Deletes a House. */
  deleteHouse?: Maybe<DeleteHousePayload>;
  /** Creates a Destination. */
  createDestination?: Maybe<CreateDestinationPayload>;
  /** Updates a Destination. */
  updateDestination?: Maybe<UpdateDestinationPayload>;
  /** Deletes a Destination. */
  deleteDestination?: Maybe<DeleteDestinationPayload>;
  /** Deletes a HouseRoom. */
  deleteHouseRoom?: Maybe<DeleteHouseRoomPayload>;
  /** Updates a HouseRoom. */
  updateHouseRoom?: Maybe<UpdateHouseRoomPayload>;
  /** Creates a HouseRoom. */
  createHouseRoom?: Maybe<CreateHouseRoomPayload>;
  /** Deletes a HouseSeason. */
  deleteHouseSeason?: Maybe<DeleteHouseSeasonPayload>;
  /** Updates a HouseSeason. */
  updateHouseSeason?: Maybe<UpdateHouseSeasonPayload>;
  /** Creates a HouseSeason. */
  createHouseSeason?: Maybe<CreateHouseSeasonPayload>;
  /** Creates a Location. */
  createLocation?: Maybe<CreateLocationPayload>;
  /** Updates a Location. */
  updateLocation?: Maybe<UpdateLocationPayload>;
  /** Deletes a Location. */
  deleteLocation?: Maybe<DeleteLocationPayload>;
  /** Deletes a NotificationTourTemplate. */
  deleteNotificationTourTemplate?: Maybe<DeleteNotificationTourTemplatePayload>;
  /** Updates a NotificationTourTemplate. */
  updateNotificationTourTemplate?: Maybe<UpdateNotificationTourTemplatePayload>;
  /** Creates a NotificationTourTemplate. */
  createNotificationTourTemplate?: Maybe<CreateNotificationTourTemplatePayload>;
  /** Creates a Guide. */
  createGuide?: Maybe<CreateGuidePayload>;
  /** Updates a Guide. */
  updateGuide?: Maybe<UpdateGuidePayload>;
  /** Deletes a Guide. */
  deleteGuide?: Maybe<DeleteGuidePayload>;
  /** Deletes a HouseFeature. */
  deleteHouseFeature?: Maybe<DeleteHouseFeaturePayload>;
  /** Updates a HouseFeature. */
  updateHouseFeature?: Maybe<UpdateHouseFeaturePayload>;
  /** Creates a HouseFeature. */
  createHouseFeature?: Maybe<CreateHouseFeaturePayload>;
  /** Deletes a Province. */
  deleteProvince?: Maybe<DeleteProvincePayload>;
  /** Updates a Province. */
  updateProvince?: Maybe<UpdateProvincePayload>;
  /** Creates a Province. */
  createProvince?: Maybe<CreateProvincePayload>;
  /** Creates a TransportationRoute. */
  createTransportationRoute?: Maybe<CreateTransportationRoutePayload>;
  /** Updates a TransportationRoute. */
  updateTransportationRoute?: Maybe<UpdateTransportationRoutePayload>;
  /** Deletes a TransportationRoute. */
  deleteTransportationRoute?: Maybe<DeleteTransportationRoutePayload>;
  /** Deletes a HouseSeasonRoom. */
  deleteHouseSeasonRoom?: Maybe<DeleteHouseSeasonRoomPayload>;
  /** Updates a HouseSeasonRoom. */
  updateHouseSeasonRoom?: Maybe<UpdateHouseSeasonRoomPayload>;
  /** Creates a HouseSeasonRoom. */
  createHouseSeasonRoom?: Maybe<CreateHouseSeasonRoomPayload>;
  /** Deletes a HouseType. */
  deleteHouseType?: Maybe<DeleteHouseTypePayload>;
  /** Updates a HouseType. */
  updateHouseType?: Maybe<UpdateHouseTypePayload>;
  /** Creates a HouseType. */
  createHouseType?: Maybe<CreateHouseTypePayload>;
  /** Creates a Notification. */
  createNotification?: Maybe<CreateNotificationPayload>;
  /** Prioritys a Notification. */
  priorityNotification?: Maybe<PriorityNotificationPayload>;
  /** Updates a Notification. */
  updateNotification?: Maybe<UpdateNotificationPayload>;
  /** Deletes a Notification. */
  deleteNotification?: Maybe<DeleteNotificationPayload>;
};


export type MutationCreateActivityComboArgs = {
  input: CreateActivityComboInput;
};


export type MutationPriorityActivityComboArgs = {
  input: PriorityActivityComboInput;
};


export type MutationUpdateActivityComboArgs = {
  input: UpdateActivityComboInput;
};


export type MutationDeleteActivityComboArgs = {
  input: DeleteActivityComboInput;
};


export type MutationDeleteTourTemplateArgs = {
  input: DeleteTourTemplateInput;
};


export type MutationUpdateTourTemplateArgs = {
  input: UpdateTourTemplateInput;
};


export type MutationCreateTourTemplateArgs = {
  input: CreateTourTemplateInput;
};


export type MutationDeleteHouseRoomTypeArgs = {
  input: DeleteHouseRoomTypeInput;
};


export type MutationUpdateHouseRoomTypeArgs = {
  input: UpdateHouseRoomTypeInput;
};


export type MutationCreateHouseRoomTypeArgs = {
  input: CreateHouseRoomTypeInput;
};


export type MutationDeleteTransportationPriceArgs = {
  input: DeleteTransportationPriceInput;
};


export type MutationUpdateTransportationPriceArgs = {
  input: UpdateTransportationPriceInput;
};


export type MutationCreateTransportationPriceArgs = {
  input: CreateTransportationPriceInput;
};


export type MutationDeleteTransportationArgs = {
  input: DeleteTransportationInput;
};


export type MutationUpdateTransportationArgs = {
  input: UpdateTransportationInput;
};


export type MutationCreateTransportationArgs = {
  input: CreateTransportationInput;
};


export type MutationCreateDriverArgs = {
  input: CreateDriverInput;
};


export type MutationUpdateDriverArgs = {
  input: UpdateDriverInput;
};


export type MutationDeleteDriverArgs = {
  input: DeleteDriverInput;
};


export type MutationCreateActivityArgs = {
  input: CreateActivityInput;
};


export type MutationUpdateActivityArgs = {
  input: UpdateActivityInput;
};


export type MutationDeleteActivityArgs = {
  input: DeleteActivityInput;
};


export type MutationDeleteServiceArgs = {
  input: DeleteServiceInput;
};


export type MutationUpdateServiceArgs = {
  input: UpdateServiceInput;
};


export type MutationCreateServiceArgs = {
  input: CreateServiceInput;
};


export type MutationCreateLocationDistanceArgs = {
  input: CreateLocationDistanceInput;
};


export type MutationUpdateLocationDistanceArgs = {
  input: UpdateLocationDistanceInput;
};


export type MutationDeleteLocationDistanceArgs = {
  input: DeleteLocationDistanceInput;
};


export type MutationCreateHouseArgs = {
  input: CreateHouseInput;
};


export type MutationUpdateHouseArgs = {
  input: UpdateHouseInput;
};


export type MutationDeleteHouseArgs = {
  input: DeleteHouseInput;
};


export type MutationCreateDestinationArgs = {
  input: CreateDestinationInput;
};


export type MutationUpdateDestinationArgs = {
  input: UpdateDestinationInput;
};


export type MutationDeleteDestinationArgs = {
  input: DeleteDestinationInput;
};


export type MutationDeleteHouseRoomArgs = {
  input: DeleteHouseRoomInput;
};


export type MutationUpdateHouseRoomArgs = {
  input: UpdateHouseRoomInput;
};


export type MutationCreateHouseRoomArgs = {
  input: CreateHouseRoomInput;
};


export type MutationDeleteHouseSeasonArgs = {
  input: DeleteHouseSeasonInput;
};


export type MutationUpdateHouseSeasonArgs = {
  input: UpdateHouseSeasonInput;
};


export type MutationCreateHouseSeasonArgs = {
  input: CreateHouseSeasonInput;
};


export type MutationCreateLocationArgs = {
  input: CreateLocationInput;
};


export type MutationUpdateLocationArgs = {
  input: UpdateLocationInput;
};


export type MutationDeleteLocationArgs = {
  input: DeleteLocationInput;
};


export type MutationDeleteNotificationTourTemplateArgs = {
  input: DeleteNotificationTourTemplateInput;
};


export type MutationUpdateNotificationTourTemplateArgs = {
  input: UpdateNotificationTourTemplateInput;
};


export type MutationCreateNotificationTourTemplateArgs = {
  input: CreateNotificationTourTemplateInput;
};


export type MutationCreateGuideArgs = {
  input: CreateGuideInput;
};


export type MutationUpdateGuideArgs = {
  input: UpdateGuideInput;
};


export type MutationDeleteGuideArgs = {
  input: DeleteGuideInput;
};


export type MutationDeleteHouseFeatureArgs = {
  input: DeleteHouseFeatureInput;
};


export type MutationUpdateHouseFeatureArgs = {
  input: UpdateHouseFeatureInput;
};


export type MutationCreateHouseFeatureArgs = {
  input: CreateHouseFeatureInput;
};


export type MutationDeleteProvinceArgs = {
  input: DeleteProvinceInput;
};


export type MutationUpdateProvinceArgs = {
  input: UpdateProvinceInput;
};


export type MutationCreateProvinceArgs = {
  input: CreateProvinceInput;
};


export type MutationCreateTransportationRouteArgs = {
  input: CreateTransportationRouteInput;
};


export type MutationUpdateTransportationRouteArgs = {
  input: UpdateTransportationRouteInput;
};


export type MutationDeleteTransportationRouteArgs = {
  input: DeleteTransportationRouteInput;
};


export type MutationDeleteHouseSeasonRoomArgs = {
  input: DeleteHouseSeasonRoomInput;
};


export type MutationUpdateHouseSeasonRoomArgs = {
  input: UpdateHouseSeasonRoomInput;
};


export type MutationCreateHouseSeasonRoomArgs = {
  input: CreateHouseSeasonRoomInput;
};


export type MutationDeleteHouseTypeArgs = {
  input: DeleteHouseTypeInput;
};


export type MutationUpdateHouseTypeArgs = {
  input: UpdateHouseTypeInput;
};


export type MutationCreateHouseTypeArgs = {
  input: CreateHouseTypeInput;
};


export type MutationCreateNotificationArgs = {
  input: CreateNotificationInput;
};


export type MutationPriorityNotificationArgs = {
  input: PriorityNotificationInput;
};


export type MutationUpdateNotificationArgs = {
  input: UpdateNotificationInput;
};


export type MutationDeleteNotificationArgs = {
  input: DeleteNotificationInput;
};

/** A node, according to the Relay specification. */
export type Node = {
  /** The id of this node. */
  id: Scalars['ID'];
};

export type Notification = Node & {
  __typename?: 'Notification';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  days?: Maybe<Scalars['Int']>;
  priority?: Maybe<Scalars['Int']>;
  services?: Maybe<Array<Maybe<Service>>>;
  tourTemplateNotifications?: Maybe<NotificationConnection>;
  notification?: Maybe<Notification>;
};


export type NotificationTourTemplateNotificationsArgs = {
  page?: Maybe<Scalars['Int']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  order?: Maybe<Array<Maybe<NotificationFilter_Order>>>;
  services_code?: Maybe<Scalars['String']>;
  services_code_list?: Maybe<Array<Maybe<Scalars['String']>>>;
};

/** Connection for Notification. */
export type NotificationConnection = {
  __typename?: 'NotificationConnection';
  collection?: Maybe<Array<Maybe<Notification>>>;
  paginationInfo: NotificationPaginationInfo;
};

export type NotificationFilter_Order = {
  name?: Maybe<Scalars['String']>;
  priority?: Maybe<Scalars['String']>;
};

/** Information about the pagination. */
export type NotificationPaginationInfo = {
  __typename?: 'NotificationPaginationInfo';
  itemsPerPage: Scalars['Int'];
  lastPage: Scalars['Int'];
  totalCount: Scalars['Int'];
};

export type NotificationTourTemplate = Node & {
  __typename?: 'NotificationTourTemplate';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  tourTemplate: TourTemplate;
  notification: Notification;
  days: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
};

export type Province = Node & {
  __typename?: 'Province';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  destinations?: Maybe<Array<Maybe<Destination>>>;
};


export type ProvinceDestinationsArgs = {
  order?: Maybe<Array<Maybe<DestinationFilter_Order>>>;
};

export type Query = {
  __typename?: 'Query';
  node?: Maybe<Node>;
  activityCombos?: Maybe<Array<Maybe<ActivityCombo>>>;
  activityCombo?: Maybe<ActivityCombo>;
  tourTemplate?: Maybe<TourTemplate>;
  tourTemplates?: Maybe<Array<Maybe<TourTemplate>>>;
  houseRoomType?: Maybe<HouseRoomType>;
  houseRoomTypes?: Maybe<Array<Maybe<HouseRoomType>>>;
  transportationPrice?: Maybe<TransportationPrice>;
  transportationPrices?: Maybe<Array<Maybe<TransportationPrice>>>;
  transportation?: Maybe<Transportation>;
  transportations?: Maybe<Array<Maybe<Transportation>>>;
  listDrivers?: Maybe<DriverConnection>;
  driver?: Maybe<Driver>;
  drivers?: Maybe<Array<Maybe<Driver>>>;
  listActivities?: Maybe<Array<Maybe<Activity>>>;
  activity?: Maybe<Activity>;
  activities?: Maybe<Array<Maybe<Activity>>>;
  service?: Maybe<Service>;
  services?: Maybe<Array<Maybe<Service>>>;
  listLocationDistances?: Maybe<LocationDistanceConnection>;
  locationDistance?: Maybe<LocationDistance>;
  locationDistances?: Maybe<Array<Maybe<LocationDistance>>>;
  listHouses?: Maybe<HouseConnection>;
  house?: Maybe<House>;
  houses?: Maybe<Array<Maybe<House>>>;
  listDestinations?: Maybe<DestinationConnection>;
  destination?: Maybe<Destination>;
  destinations?: Maybe<Array<Maybe<Destination>>>;
  houseRoom?: Maybe<HouseRoom>;
  houseRooms?: Maybe<Array<Maybe<HouseRoom>>>;
  houseSeason?: Maybe<HouseSeason>;
  houseSeasons?: Maybe<Array<Maybe<HouseSeason>>>;
  listLocations?: Maybe<LocationConnection>;
  location?: Maybe<Location>;
  locations?: Maybe<Array<Maybe<Location>>>;
  notificationTourTemplate?: Maybe<NotificationTourTemplate>;
  notificationTourTemplates?: Maybe<Array<Maybe<NotificationTourTemplate>>>;
  listGuides?: Maybe<GuideConnection>;
  guide?: Maybe<Guide>;
  guides?: Maybe<Array<Maybe<Guide>>>;
  houseFeature?: Maybe<HouseFeature>;
  houseFeatures?: Maybe<Array<Maybe<HouseFeature>>>;
  province?: Maybe<Province>;
  provinces?: Maybe<Array<Maybe<Province>>>;
  transportationRoute?: Maybe<TransportationRoute>;
  transportationRoutes?: Maybe<Array<Maybe<TransportationRoute>>>;
  houseSeasonRoom?: Maybe<HouseSeasonRoom>;
  houseSeasonRooms?: Maybe<Array<Maybe<HouseSeasonRoom>>>;
  houseType?: Maybe<HouseType>;
  houseTypes?: Maybe<Array<Maybe<HouseType>>>;
  listNotifications?: Maybe<NotificationConnection>;
  notification?: Maybe<Notification>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
};


export type QueryNodeArgs = {
  id: Scalars['ID'];
};


export type QueryActivityComboArgs = {
  id: Scalars['ID'];
};


export type QueryTourTemplateArgs = {
  id: Scalars['ID'];
};


export type QueryTourTemplatesArgs = {
  tourType?: Maybe<Scalars['String']>;
  tourType_list?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryHouseRoomTypeArgs = {
  id: Scalars['ID'];
};


export type QueryTransportationPriceArgs = {
  id: Scalars['ID'];
};


export type QueryTransportationArgs = {
  id: Scalars['ID'];
};


export type QueryListDriversArgs = {
  page?: Maybe<Scalars['Int']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  order?: Maybe<Array<Maybe<DriverFilter_Order>>>;
  needle?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<Scalars['String']>>>;
  entity?: Maybe<Scalars['String']>;
};


export type QueryDriverArgs = {
  id: Scalars['ID'];
};


export type QueryDriversArgs = {
  order?: Maybe<Array<Maybe<DriverFilter_Order>>>;
};


export type QueryListActivitiesArgs = {
  order?: Maybe<Array<Maybe<ActivityFilter_Order>>>;
  needle?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<Scalars['String']>>>;
  entity?: Maybe<Scalars['String']>;
};


export type QueryActivityArgs = {
  id: Scalars['ID'];
};


export type QueryActivitiesArgs = {
  order?: Maybe<Array<Maybe<ActivityFilter_Order>>>;
};


export type QueryServiceArgs = {
  id: Scalars['ID'];
};


export type QueryListLocationDistancesArgs = {
  page?: Maybe<Scalars['Int']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  needle?: Maybe<Scalars['String']>;
  entity?: Maybe<Scalars['String']>;
};


export type QueryLocationDistanceArgs = {
  id: Scalars['ID'];
};


export type QueryListHousesArgs = {
  page?: Maybe<Scalars['Int']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  order?: Maybe<Array<Maybe<HouseFilter_Order>>>;
  needle?: Maybe<Scalars['String']>;
  entity?: Maybe<Scalars['String']>;
};


export type QueryHouseArgs = {
  id: Scalars['ID'];
};


export type QueryHousesArgs = {
  order?: Maybe<Array<Maybe<HouseFilter_Order>>>;
};


export type QueryListDestinationsArgs = {
  page?: Maybe<Scalars['Int']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  order?: Maybe<Array<Maybe<DestinationFilter_Order>>>;
  needle?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<Scalars['String']>>>;
  entity?: Maybe<Scalars['String']>;
};


export type QueryDestinationArgs = {
  id: Scalars['ID'];
};


export type QueryDestinationsArgs = {
  order?: Maybe<Array<Maybe<DestinationFilter_Order>>>;
};


export type QueryHouseRoomArgs = {
  id: Scalars['ID'];
};


export type QueryHouseSeasonArgs = {
  id: Scalars['ID'];
};


export type QueryListLocationsArgs = {
  page?: Maybe<Scalars['Int']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  order?: Maybe<Array<Maybe<LocationFilter_Order>>>;
  needle?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<Scalars['String']>>>;
  entity?: Maybe<Scalars['String']>;
};


export type QueryLocationArgs = {
  id: Scalars['ID'];
};


export type QueryLocationsArgs = {
  order?: Maybe<Array<Maybe<LocationFilter_Order>>>;
};


export type QueryNotificationTourTemplateArgs = {
  id: Scalars['ID'];
};


export type QueryListGuidesArgs = {
  page?: Maybe<Scalars['Int']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  order?: Maybe<Array<Maybe<GuideFilter_Order>>>;
  needle?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<Scalars['String']>>>;
  entity?: Maybe<Scalars['String']>;
};


export type QueryGuideArgs = {
  id: Scalars['ID'];
};


export type QueryGuidesArgs = {
  order?: Maybe<Array<Maybe<GuideFilter_Order>>>;
};


export type QueryHouseFeatureArgs = {
  id: Scalars['ID'];
};


export type QueryProvinceArgs = {
  id: Scalars['ID'];
};


export type QueryTransportationRouteArgs = {
  id: Scalars['ID'];
};


export type QueryHouseSeasonRoomArgs = {
  id: Scalars['ID'];
};


export type QueryHouseTypeArgs = {
  id: Scalars['ID'];
};


export type QueryListNotificationsArgs = {
  page?: Maybe<Scalars['Int']>;
  itemsPerPage?: Maybe<Scalars['Int']>;
  order?: Maybe<Array<Maybe<NotificationFilter_Order>>>;
  needle?: Maybe<Scalars['String']>;
  properties?: Maybe<Array<Maybe<Scalars['String']>>>;
  entity?: Maybe<Scalars['String']>;
  orderPriority?: Maybe<Array<Maybe<Scalars['String']>>>;
};


export type QueryNotificationArgs = {
  id: Scalars['ID'];
};


export type QueryNotificationsArgs = {
  order?: Maybe<Array<Maybe<NotificationFilter_Order>>>;
  services_code?: Maybe<Scalars['String']>;
  services_code_list?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Service = Node & {
  __typename?: 'Service';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  code?: Maybe<Scalars['String']>;
  daysToShow?: Maybe<Scalars['Int']>;
  notifications?: Maybe<Array<Maybe<Notification>>>;
};


export type ServiceNotificationsArgs = {
  order?: Maybe<Array<Maybe<NotificationFilter_Order>>>;
  services_code?: Maybe<Scalars['String']>;
  services_code_list?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type TourTemplate = Node & {
  __typename?: 'TourTemplate';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  code?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  tourType?: Maybe<Scalars['String']>;
  guideWage?: Maybe<Scalars['Float']>;
  color?: Maybe<Scalars['String']>;
  startPlace?: Maybe<Scalars['String']>;
  finishPlace?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  activities?: Maybe<Array<Maybe<Activity>>>;
  template1?: Maybe<TourTemplate>;
  template2?: Maybe<TourTemplate>;
  bonus?: Maybe<Scalars['Int']>;
  days?: Maybe<Scalars['Int']>;
  startDay?: Maybe<Scalars['String']>;
  transferIn?: Maybe<Destination>;
  transferOut?: Maybe<Destination>;
  transportation?: Maybe<Transportation>;
  houseType?: Maybe<HouseType>;
  notifications?: Maybe<Array<Maybe<NotificationTourTemplate>>>;
};


export type TourTemplateActivitiesArgs = {
  order?: Maybe<Array<Maybe<ActivityFilter_Order>>>;
};

export type Transportation = Node & {
  __typename?: 'Transportation';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  name: Scalars['String'];
  driver?: Maybe<Driver>;
  prices?: Maybe<Array<Maybe<TransportationPrice>>>;
  routes?: Maybe<Array<Maybe<TransportationRoute>>>;
};

export type TransportationPrice = Node & {
  __typename?: 'TransportationPrice';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  min: Scalars['Int'];
  max: Scalars['Int'];
  price: Scalars['Float'];
  transportation?: Maybe<Transportation>;
};

export type TransportationRoute = Node & {
  __typename?: 'TransportationRoute';
  id: Scalars['ID'];
  _id: Scalars['Int'];
  locationFrom?: Maybe<Location>;
  locationTo: Location;
  kms?: Maybe<Scalars['Int']>;
  transportation?: Maybe<Transportation>;
};

export type CreateActivityComboInput = {
  priority?: Maybe<Scalars['Int']>;
  activity: Scalars['String'];
  parent: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateActivityComboPayload = {
  __typename?: 'createActivityComboPayload';
  activityCombo?: Maybe<ActivityCombo>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateActivityInput = {
  name: Scalars['String'];
  destination?: Maybe<Scalars['String']>;
  personCost?: Maybe<Scalars['Int']>;
  guideCost?: Maybe<Scalars['Int']>;
  carCost?: Maybe<Scalars['Int']>;
  personPerCar?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  activities?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateActivityPayload = {
  __typename?: 'createActivityPayload';
  activity?: Maybe<Activity>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateDestinationInput = {
  name: Scalars['String'];
  province: Scalars['String'];
  houses?: Maybe<Array<Maybe<Scalars['String']>>>;
  activities?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateDestinationPayload = {
  __typename?: 'createDestinationPayload';
  destination?: Maybe<Destination>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateDriverInput = {
  name: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  pax?: Maybe<Scalars['Int']>;
  transportations?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateDriverPayload = {
  __typename?: 'createDriverPayload';
  driver?: Maybe<Driver>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateGuideInput = {
  name: Scalars['String'];
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  bonus?: Maybe<Scalars['Int']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateGuidePayload = {
  __typename?: 'createGuidePayload';
  guide?: Maybe<Guide>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseFeatureInput = {
  name: Scalars['String'];
  houses?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseFeaturePayload = {
  __typename?: 'createHouseFeaturePayload';
  houseFeature?: Maybe<HouseFeature>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseInput = {
  name: Scalars['String'];
  address?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  features?: Maybe<Array<Maybe<Scalars['String']>>>;
  rooms?: Maybe<Array<Maybe<Scalars['String']>>>;
  houseSeasons?: Maybe<Array<Maybe<Scalars['String']>>>;
  destination?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHousePayload = {
  __typename?: 'createHousePayload';
  house?: Maybe<House>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseRoomInput = {
  price?: Maybe<Scalars['Int']>;
  roomType: Scalars['String'];
  house?: Maybe<Scalars['String']>;
  houseSeasonRooms?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseRoomPayload = {
  __typename?: 'createHouseRoomPayload';
  houseRoom?: Maybe<HouseRoom>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseRoomTypeInput = {
  name: Scalars['String'];
  houseRooms?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseRoomTypePayload = {
  __typename?: 'createHouseRoomTypePayload';
  houseRoomType?: Maybe<HouseRoomType>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseSeasonInput = {
  startDate: Scalars['String'];
  endDate: Scalars['String'];
  seasonRooms?: Maybe<Array<Maybe<Scalars['String']>>>;
  house: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseSeasonPayload = {
  __typename?: 'createHouseSeasonPayload';
  houseSeason?: Maybe<HouseSeason>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseSeasonRoomInput = {
  price?: Maybe<Scalars['Int']>;
  room: Scalars['String'];
  houseSeason: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseSeasonRoomPayload = {
  __typename?: 'createHouseSeasonRoomPayload';
  houseSeasonRoom?: Maybe<HouseSeasonRoom>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseTypeInput = {
  name: Scalars['String'];
  houses?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateHouseTypePayload = {
  __typename?: 'createHouseTypePayload';
  houseType?: Maybe<HouseType>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateLocationDistanceInput = {
  location1: Scalars['String'];
  location2: Scalars['String'];
  kms: Scalars['Int'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateLocationDistancePayload = {
  __typename?: 'createLocationDistancePayload';
  locationDistance?: Maybe<LocationDistance>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateLocationInput = {
  name: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateLocationPayload = {
  __typename?: 'createLocationPayload';
  location?: Maybe<Location>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateNotificationInput = {
  name: Scalars['String'];
  icon?: Maybe<Scalars['String']>;
  days?: Maybe<Scalars['Int']>;
  priority?: Maybe<Scalars['Int']>;
  services?: Maybe<Array<Maybe<Scalars['String']>>>;
  tourTemplateNotifications?: Maybe<Array<Maybe<Scalars['String']>>>;
  notification?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateNotificationPayload = {
  __typename?: 'createNotificationPayload';
  notification?: Maybe<Notification>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateNotificationTourTemplateInput = {
  tourTemplate: Scalars['String'];
  notification: Scalars['String'];
  days: Scalars['Int'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateNotificationTourTemplatePayload = {
  __typename?: 'createNotificationTourTemplatePayload';
  notificationTourTemplate?: Maybe<NotificationTourTemplate>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateProvinceInput = {
  name: Scalars['String'];
  destinations?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateProvincePayload = {
  __typename?: 'createProvincePayload';
  province?: Maybe<Province>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateServiceInput = {
  name: Scalars['String'];
  code?: Maybe<Scalars['String']>;
  daysToShow?: Maybe<Scalars['Int']>;
  notifications?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateServicePayload = {
  __typename?: 'createServicePayload';
  service?: Maybe<Service>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateTourTemplateInput = {
  name: Scalars['String'];
  code?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  tourType?: Maybe<Scalars['String']>;
  guideWage?: Maybe<Scalars['Float']>;
  color?: Maybe<Scalars['String']>;
  startPlace?: Maybe<Scalars['String']>;
  finishPlace?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  activities?: Maybe<Array<Maybe<Scalars['String']>>>;
  template1?: Maybe<Scalars['String']>;
  template2?: Maybe<Scalars['String']>;
  bonus?: Maybe<Scalars['Int']>;
  days?: Maybe<Scalars['Int']>;
  startDay?: Maybe<Scalars['String']>;
  transferIn?: Maybe<Scalars['String']>;
  transferOut?: Maybe<Scalars['String']>;
  transportation?: Maybe<Scalars['String']>;
  houseType?: Maybe<Scalars['String']>;
  itineraries?: Maybe<Array<Maybe<Scalars['String']>>>;
  notifications?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateTourTemplatePayload = {
  __typename?: 'createTourTemplatePayload';
  tourTemplate?: Maybe<TourTemplate>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateTransportationInput = {
  name: Scalars['String'];
  driver?: Maybe<Scalars['String']>;
  prices?: Maybe<Array<Maybe<Scalars['String']>>>;
  routes?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateTransportationPayload = {
  __typename?: 'createTransportationPayload';
  transportation?: Maybe<Transportation>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateTransportationPriceInput = {
  min: Scalars['Int'];
  max: Scalars['Int'];
  price: Scalars['Float'];
  transportation?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateTransportationPricePayload = {
  __typename?: 'createTransportationPricePayload';
  transportationPrice?: Maybe<TransportationPrice>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateTransportationRouteInput = {
  locationFrom?: Maybe<Scalars['String']>;
  locationTo: Scalars['String'];
  kms?: Maybe<Scalars['Int']>;
  transportation?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type CreateTransportationRoutePayload = {
  __typename?: 'createTransportationRoutePayload';
  transportationRoute?: Maybe<TransportationRoute>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteActivityComboInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteActivityComboPayload = {
  __typename?: 'deleteActivityComboPayload';
  activityCombo?: Maybe<ActivityCombo>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteActivityInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteActivityPayload = {
  __typename?: 'deleteActivityPayload';
  activity?: Maybe<Activity>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteDestinationInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteDestinationPayload = {
  __typename?: 'deleteDestinationPayload';
  destination?: Maybe<Destination>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteDriverInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteDriverPayload = {
  __typename?: 'deleteDriverPayload';
  driver?: Maybe<Driver>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteGuideInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteGuidePayload = {
  __typename?: 'deleteGuidePayload';
  guide?: Maybe<Guide>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseFeatureInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseFeaturePayload = {
  __typename?: 'deleteHouseFeaturePayload';
  houseFeature?: Maybe<HouseFeature>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHousePayload = {
  __typename?: 'deleteHousePayload';
  house?: Maybe<House>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseRoomInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseRoomPayload = {
  __typename?: 'deleteHouseRoomPayload';
  houseRoom?: Maybe<HouseRoom>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseRoomTypeInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseRoomTypePayload = {
  __typename?: 'deleteHouseRoomTypePayload';
  houseRoomType?: Maybe<HouseRoomType>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseSeasonInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseSeasonPayload = {
  __typename?: 'deleteHouseSeasonPayload';
  houseSeason?: Maybe<HouseSeason>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseSeasonRoomInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseSeasonRoomPayload = {
  __typename?: 'deleteHouseSeasonRoomPayload';
  houseSeasonRoom?: Maybe<HouseSeasonRoom>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseTypeInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteHouseTypePayload = {
  __typename?: 'deleteHouseTypePayload';
  houseType?: Maybe<HouseType>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteLocationDistanceInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteLocationDistancePayload = {
  __typename?: 'deleteLocationDistancePayload';
  locationDistance?: Maybe<LocationDistance>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteLocationInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteLocationPayload = {
  __typename?: 'deleteLocationPayload';
  location?: Maybe<Location>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteNotificationInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteNotificationPayload = {
  __typename?: 'deleteNotificationPayload';
  notification?: Maybe<Notification>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteNotificationTourTemplateInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteNotificationTourTemplatePayload = {
  __typename?: 'deleteNotificationTourTemplatePayload';
  notificationTourTemplate?: Maybe<NotificationTourTemplate>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteProvinceInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteProvincePayload = {
  __typename?: 'deleteProvincePayload';
  province?: Maybe<Province>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteServiceInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteServicePayload = {
  __typename?: 'deleteServicePayload';
  service?: Maybe<Service>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteTourTemplateInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteTourTemplatePayload = {
  __typename?: 'deleteTourTemplatePayload';
  tourTemplate?: Maybe<TourTemplate>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteTransportationInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteTransportationPayload = {
  __typename?: 'deleteTransportationPayload';
  transportation?: Maybe<Transportation>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteTransportationPriceInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteTransportationPricePayload = {
  __typename?: 'deleteTransportationPricePayload';
  transportationPrice?: Maybe<TransportationPrice>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteTransportationRouteInput = {
  id: Scalars['ID'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type DeleteTransportationRoutePayload = {
  __typename?: 'deleteTransportationRoutePayload';
  transportationRoute?: Maybe<TransportationRoute>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type PriorityActivityComboInput = {
  id: Scalars['ID'];
  up: Scalars['Boolean'];
  entity?: Scalars['String'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type PriorityActivityComboPayload = {
  __typename?: 'priorityActivityComboPayload';
  activityCombo?: Maybe<ActivityCombo>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type PriorityNotificationInput = {
  id: Scalars['ID'];
  up: Scalars['Boolean'];
  clientMutationId?: Maybe<Scalars['String']>;
};

export type PriorityNotificationPayload = {
  __typename?: 'priorityNotificationPayload';
  notification?: Maybe<Notification>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateActivityComboInput = {
  id: Scalars['ID'];
  priority?: Maybe<Scalars['Int']>;
  activity?: Maybe<Scalars['String']>;
  parent?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateActivityComboPayload = {
  __typename?: 'updateActivityComboPayload';
  activityCombo?: Maybe<ActivityCombo>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateActivityInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  destination?: Maybe<Scalars['String']>;
  personCost?: Maybe<Scalars['Int']>;
  guideCost?: Maybe<Scalars['Int']>;
  carCost?: Maybe<Scalars['Int']>;
  personPerCar?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  activities?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateActivityPayload = {
  __typename?: 'updateActivityPayload';
  activity?: Maybe<Activity>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateDestinationInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  province?: Maybe<Scalars['String']>;
  houses?: Maybe<Array<Maybe<Scalars['String']>>>;
  activities?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateDestinationPayload = {
  __typename?: 'updateDestinationPayload';
  destination?: Maybe<Destination>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateDriverInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  pax?: Maybe<Scalars['Int']>;
  transportations?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateDriverPayload = {
  __typename?: 'updateDriverPayload';
  driver?: Maybe<Driver>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateGuideInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  bonus?: Maybe<Scalars['Int']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateGuidePayload = {
  __typename?: 'updateGuidePayload';
  guide?: Maybe<Guide>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseFeatureInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  houses?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseFeaturePayload = {
  __typename?: 'updateHouseFeaturePayload';
  houseFeature?: Maybe<HouseFeature>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  features?: Maybe<Array<Maybe<Scalars['String']>>>;
  rooms?: Maybe<Array<Maybe<Scalars['String']>>>;
  houseSeasons?: Maybe<Array<Maybe<Scalars['String']>>>;
  destination?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHousePayload = {
  __typename?: 'updateHousePayload';
  house?: Maybe<House>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseRoomInput = {
  id: Scalars['ID'];
  price?: Maybe<Scalars['Int']>;
  roomType?: Maybe<Scalars['String']>;
  house?: Maybe<Scalars['String']>;
  houseSeasonRooms?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseRoomPayload = {
  __typename?: 'updateHouseRoomPayload';
  houseRoom?: Maybe<HouseRoom>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseRoomTypeInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  houseRooms?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseRoomTypePayload = {
  __typename?: 'updateHouseRoomTypePayload';
  houseRoomType?: Maybe<HouseRoomType>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseSeasonInput = {
  id: Scalars['ID'];
  startDate?: Maybe<Scalars['String']>;
  endDate?: Maybe<Scalars['String']>;
  seasonRooms?: Maybe<Array<Maybe<Scalars['String']>>>;
  house?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseSeasonPayload = {
  __typename?: 'updateHouseSeasonPayload';
  houseSeason?: Maybe<HouseSeason>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseSeasonRoomInput = {
  id: Scalars['ID'];
  price?: Maybe<Scalars['Int']>;
  room?: Maybe<Scalars['String']>;
  houseSeason?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseSeasonRoomPayload = {
  __typename?: 'updateHouseSeasonRoomPayload';
  houseSeasonRoom?: Maybe<HouseSeasonRoom>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseTypeInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  houses?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateHouseTypePayload = {
  __typename?: 'updateHouseTypePayload';
  houseType?: Maybe<HouseType>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateLocationDistanceInput = {
  id: Scalars['ID'];
  location1?: Maybe<Scalars['String']>;
  location2?: Maybe<Scalars['String']>;
  kms?: Maybe<Scalars['Int']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateLocationDistancePayload = {
  __typename?: 'updateLocationDistancePayload';
  locationDistance?: Maybe<LocationDistance>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateLocationInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateLocationPayload = {
  __typename?: 'updateLocationPayload';
  location?: Maybe<Location>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateNotificationInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  days?: Maybe<Scalars['Int']>;
  priority?: Maybe<Scalars['Int']>;
  services?: Maybe<Array<Maybe<Scalars['String']>>>;
  tourTemplateNotifications?: Maybe<Array<Maybe<Scalars['String']>>>;
  notification?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateNotificationPayload = {
  __typename?: 'updateNotificationPayload';
  notification?: Maybe<Notification>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateNotificationTourTemplateInput = {
  id: Scalars['ID'];
  tourTemplate?: Maybe<Scalars['String']>;
  notification?: Maybe<Scalars['String']>;
  days?: Maybe<Scalars['Int']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateNotificationTourTemplatePayload = {
  __typename?: 'updateNotificationTourTemplatePayload';
  notificationTourTemplate?: Maybe<NotificationTourTemplate>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateProvinceInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  destinations?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateProvincePayload = {
  __typename?: 'updateProvincePayload';
  province?: Maybe<Province>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateServiceInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  daysToShow?: Maybe<Scalars['Int']>;
  notifications?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateServicePayload = {
  __typename?: 'updateServicePayload';
  service?: Maybe<Service>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateTourTemplateInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  tourType?: Maybe<Scalars['String']>;
  guideWage?: Maybe<Scalars['Float']>;
  color?: Maybe<Scalars['String']>;
  startPlace?: Maybe<Scalars['String']>;
  finishPlace?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  activities?: Maybe<Array<Maybe<Scalars['String']>>>;
  template1?: Maybe<Scalars['String']>;
  template2?: Maybe<Scalars['String']>;
  bonus?: Maybe<Scalars['Int']>;
  days?: Maybe<Scalars['Int']>;
  startDay?: Maybe<Scalars['String']>;
  transferIn?: Maybe<Scalars['String']>;
  transferOut?: Maybe<Scalars['String']>;
  transportation?: Maybe<Scalars['String']>;
  houseType?: Maybe<Scalars['String']>;
  itineraries?: Maybe<Array<Maybe<Scalars['String']>>>;
  notifications?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateTourTemplatePayload = {
  __typename?: 'updateTourTemplatePayload';
  tourTemplate?: Maybe<TourTemplate>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateTransportationInput = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  driver?: Maybe<Scalars['String']>;
  prices?: Maybe<Array<Maybe<Scalars['String']>>>;
  routes?: Maybe<Array<Maybe<Scalars['String']>>>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateTransportationPayload = {
  __typename?: 'updateTransportationPayload';
  transportation?: Maybe<Transportation>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateTransportationPriceInput = {
  id: Scalars['ID'];
  min?: Maybe<Scalars['Int']>;
  max?: Maybe<Scalars['Int']>;
  price?: Maybe<Scalars['Float']>;
  transportation?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateTransportationPricePayload = {
  __typename?: 'updateTransportationPricePayload';
  transportationPrice?: Maybe<TransportationPrice>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateTransportationRouteInput = {
  id: Scalars['ID'];
  locationFrom?: Maybe<Scalars['String']>;
  locationTo?: Maybe<Scalars['String']>;
  kms?: Maybe<Scalars['Int']>;
  transportation?: Maybe<Scalars['String']>;
  clientMutationId?: Maybe<Scalars['String']>;
};

export type UpdateTransportationRoutePayload = {
  __typename?: 'updateTransportationRoutePayload';
  transportationRoute?: Maybe<TransportationRoute>;
  clientMutationId?: Maybe<Scalars['String']>;
};
