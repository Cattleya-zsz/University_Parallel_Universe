const DEFAULT_START_LOCATION_ID = "dorm";

export function buildRouteFromOptions(
  selectedOptions = [],
  { startLocationId = DEFAULT_START_LOCATION_ID, endLocationId = DEFAULT_START_LOCATION_ID } = {}
) {
  const locationIds = [
    startLocationId,
    ...selectedOptions.map((option) => option.locationId).filter(Boolean),
    endLocationId
  ];

  return removeConsecutiveDuplicates(locationIds);
}

export function removeConsecutiveDuplicates(locationIds = []) {
  return locationIds.filter((locationId, index) => {
    return index === 0 || locationId !== locationIds[index - 1];
  });
}

export function hydrateRoute(routeLocationIds = [], locations = []) {
  const locationMap = new Map(locations.map((location) => [location.id, location]));

  return routeLocationIds.map((locationId, index) => ({
    order: index + 1,
    locationId,
    location: locationMap.get(locationId) || null
  }));
}
