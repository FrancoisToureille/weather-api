import { z } from 'zod';
import { Geocoder } from '../../../domain/ports/geocoder';
import { GeocodedLocation } from '../../../domain/weather';

const banResponseSchema = z.object({
  features: z.array(z.object({
    geometry: z.object({ coordinates: z.tuple([z.number(), z.number()]) }),
    properties: z.object({ label: z.string() }),
  })),
});

export class BanGeocoder implements Geocoder {
  constructor(
    private readonly baseUrl = 'https://api-adresse.data.gouv.fr',
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async geocode(address: string): Promise<GeocodedLocation | null> {
    const url = new URL('/search/', this.baseUrl);
    url.searchParams.set('q', address);
    url.searchParams.set('limit', '1');

    const response = await this.fetchFn(url);

    if (!response.ok) {
      throw new Error(`BAN request failed with status ${response.status}`);
    }

    const result = banResponseSchema.parse(await response.json()).features[0];
    if (!result) return null;

    const [longitude, latitude] = result.geometry.coordinates;
    return { latitude, longitude, displayName: result.properties.label };
  }
}