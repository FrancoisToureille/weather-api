import { z } from 'zod';
import { GeocodedLocation } from '../../../domain/weather';
import { Geocoder } from '../../../domain/ports/geocoder';

const nominatimResultSchema = z.array(z.object({
  lat: z.string(),
  lon: z.string(),
  display_name: z.string(),
}));

export class NominatimGeocoder implements Geocoder {
  constructor(
    private readonly baseUrl = 'https://nominatim.openstreetmap.org',
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async geocode(address: string): Promise<GeocodedLocation | null> {
    const url = new URL('/search', this.baseUrl);
    url.searchParams.set('q', address);
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', '1');

    const response = await this.fetchFn(url, {
      headers: { 'User-Agent': 'weather-api/1.0' },
    });

    if (!response.ok) {
      throw new Error(`Nominatim request failed with status ${response.status}`);
    }

    const results = nominatimResultSchema.parse(await response.json());
    const result = results[0];

    return result
      ? {
          latitude: Number(result.lat),
          longitude: Number(result.lon),
          displayName: result.display_name,
        }
      : null;
  }
}