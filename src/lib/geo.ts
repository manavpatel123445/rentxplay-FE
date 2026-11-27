/**
 * Picking the renter's nearest Ahmedabad area from their device location.
 * Pure functions, no browser APIs, so they can be tested and later replaced by the API's
 * PostGIS nearby search (PRD FR-12). Coordinates never leave the browser: only the area name does.
 */

export type LatLng = { lat: number; lng: number };

/** Ahmedabad city centre (Lal Darwaja), used to tell whether someone is in the service area. */
export const CITY_CENTRE: LatLng = { lat: 23.0225, lng: 72.5714 };
/** Beyond this distance from the centre we don't guess an area: GearLoop launches in Ahmedabad only. */
export const SERVICE_RADIUS_KM = 30;
/** An area further away than this isn't "near you", so nothing is picked automatically. */
export const NEAR_AREA_MAX_KM = 10;

/** Approximate centre of each neighbourhood that has listings. Good enough to pick the nearest one. */
export const AREA_CENTRES: Record<string, LatLng> = {
  Satellite: { lat: 23.03, lng: 72.517 },
  Bodakdev: { lat: 23.039, lng: 72.507 },
  "Prahlad Nagar": { lat: 23.012, lng: 72.511 },
  Navrangpura: { lat: 23.037, lng: 72.56 },
  Vastrapur: { lat: 23.037, lng: 72.529 },
  Thaltej: { lat: 23.05, lng: 72.508 },
  Maninagar: { lat: 22.996, lng: 72.602 },
  Bopal: { lat: 23.033, lng: 72.463 },
};

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Straight-line (great-circle) distance between two points, in kilometres. */
export function distanceKm(a: LatLng, b: LatLng) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * The listed area closest to `here`, or null when `here` is outside the service radius,
 * no listed area is within NEAR_AREA_MAX_KM, or none of the areas has a known centre.
 */
export function nearestArea(here: LatLng, areas: string[]): { area: string; km: number } | null {
  if (distanceKm(here, CITY_CENTRE) > SERVICE_RADIUS_KM) return null;
  let best: { area: string; km: number } | null = null;
  for (const area of areas) {
    const centre = AREA_CENTRES[area];
    if (!centre) continue;
    const km = distanceKm(here, centre);
    if (!best || km < best.km) best = { area, km };
  }
  return best && best.km <= NEAR_AREA_MAX_KM ? best : null;
}
