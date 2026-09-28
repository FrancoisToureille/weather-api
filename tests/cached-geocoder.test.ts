import { describe, expect, it } from 'vitest';
import { CachedGeocoder } from '../src/application/cached-geocoder';

describe('CachedGeocoder', () => {
  it('calls the underlying geocoder only once for the same address', async () => {
    let calls = 0;
    const geocoder = new CachedGeocoder({
      geocode: async () => {
        calls += 1;
        return { latitude: 44.12, longitude: 4.08, displayName: 'Alès' };
      },
    });

    await geocoder.geocode('Alès');
    await geocoder.geocode('  alès  ');

    expect(calls).toBe(1);
  });

  it('does not cache a failed request', async () => {
    let calls = 0;
    const geocoder = new CachedGeocoder({
      geocode: async () => {
        calls += 1;
        throw new Error('network failure');
      },
    });

    await expect(geocoder.geocode('Alès')).rejects.toThrow('network failure');
    await expect(geocoder.geocode('Alès')).rejects.toThrow('network failure');

    expect(calls).toBe(2);
  });
});