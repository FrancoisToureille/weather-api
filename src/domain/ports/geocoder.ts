import { GeocodedLocation } from '../weather';

export interface Geocoder {
  geocode(address: string): Promise<GeocodedLocation | null>;
}