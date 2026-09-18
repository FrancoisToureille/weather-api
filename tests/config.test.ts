import { describe, expect, it } from 'vitest';
import { getConfig } from '../src/composition/config';

describe('provider configuration', () => {
  it('selects BAN and MET Norway without changing the application', () => {
    expect(getConfig({ GEOCODER_PROVIDER: 'ban', WEATHER_PROVIDER: 'met-norway', MET_NORWAY_USER_AGENT: 'app contact@example.com' }))
      .toEqual({ geocoder: 'ban', weather: 'met-norway', metNorwayUserAgent: 'app contact@example.com' });
  });

  it('rejects unknown providers', () => {
    expect(() => getConfig({ GEOCODER_PROVIDER: 'unknown' })).toThrow('Unsupported GEOCODER_PROVIDER');
  });
});