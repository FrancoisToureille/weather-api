import { expect, it } from 'vitest';
import { Geocoder } from '../../src/domain/ports/geocoder';

export function geocoderContract(createGeocoder: (fetchFn: typeof fetch) => Geocoder, validResponse: object) {
  it('returns normalized coordinates for a valid address', async () => {
    const geocoder = createGeocoder(async () => new Response(JSON.stringify(validResponse), { status: 200 }));

    await expect(geocoder.geocode('Alès')).resolves.toMatchObject({
      latitude: 44.12,
      longitude: 4.08,
      displayName: expect.any(String),
    });
  });

  it('returns null when the provider returns no result', async () => {
    const emptyResponse = validResponse instanceof Object && 'features' in validResponse
      ? { features: [] }
      : [];
    const geocoder = createGeocoder(async () => new Response(JSON.stringify(emptyResponse), { status: 200 }));

    await expect(geocoder.geocode('Adresse inconnue')).resolves.toBeNull();
  });

  it('encodes accented addresses in the request', async () => {
    let requestedUrl = '';
    const geocoder = createGeocoder(async (input) => {
      requestedUrl = String(input);
      return new Response(JSON.stringify(validResponse), { status: 200 });
    });

    await geocoder.geocode('Alès');

    expect(new URL(requestedUrl).searchParams.get('q')).toBe('Alès');
  });
}