import { describe, expect, it } from 'vitest';
import { AddressNotFoundError, GetWeatherByAddress } from '../src/application/get-weather';
import { Geocoder } from '../src/domain/ports/geocoder';
import { WeatherProvider } from '../src/domain/ports/weather-provider';

describe('GetWeatherByAddress', () => {
  it('geocodes the address before requesting the forecast', async () => {
    const geocoder: Geocoder = {
      geocode: async () => ({ latitude: 48.85, longitude: 2.35, displayName: 'Paris, France' }),
    };
    const weatherProvider: WeatherProvider = {
      forecast: async () => ({
        latitude: 48.85,
        longitude: 2.35,
        timezone: 'Europe/Paris',
        hourly: { shortwave_radiation: [100] },
      }),
    };

    await expect(new GetWeatherByAddress(geocoder, weatherProvider).execute('Paris'))
      .resolves.toEqual({
        address: 'Paris, France',
        latitude: 48.85,
        longitude: 2.35,
        timezone: 'Europe/Paris',
        hourly: { shortwave_radiation: [100] },
      });
  });

  it('fails explicitly when the address cannot be geocoded', async () => {
    const geocoder: Geocoder = { geocode: async () => null };
    const weatherProvider: WeatherProvider = { forecast: async () => { throw new Error('must not be called'); } };

    await expect(new GetWeatherByAddress(geocoder, weatherProvider).execute('unknown'))
      .rejects.toBeInstanceOf(AddressNotFoundError);
  });
});