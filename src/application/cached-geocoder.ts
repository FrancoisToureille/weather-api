import { Geocoder } from '../domain/ports/geocoder';
import { GeocodedLocation } from '../domain/weather';

export class CachedGeocoder implements Geocoder {
  private readonly cache = new Map<string, Promise<GeocodedLocation | null>>();

  constructor(private readonly sourceGeocoder: Geocoder) {}

  geocode(address: string): Promise<GeocodedLocation | null> {
    const key = address.trim().toLocaleLowerCase();
    const cached = this.cache.get(key);
    if (cached) return cached;

    const result = this.sourceGeocoder.geocode(address);
    this.cache.set(key, result);
    result.catch(() => this.cache.delete(key));
    return result;
  }
}