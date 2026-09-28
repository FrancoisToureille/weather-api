import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { GetWeatherByAddress } from '../src/application/get-weather';
import { createApp } from '../src/adapters/inbound/http/app';
import { BanGeocoder } from '../src/adapters/outbound/ban/ban-geocoder';
import { MetNorwayProvider } from '../src/adapters/outbound/met-norway/met-norway-provider';

describe('GET /forecast integration', () => {
  it('chains HTTP, BAN and MET Norway adapters with mocked external APIs', async () => {
    let geocodingCalls = 0;
    let weatherCalls = 0;

    const geocoder = new BanGeocoder('https://ban.test', async (input) => {
      geocodingCalls += 1;
      expect(new URL(String(input)).searchParams.get('q')).toBe('Alès');
      return new Response(JSON.stringify({
        features: [{
          geometry: { coordinates: [4.0817, 44.1279] },
          properties: { label: 'Alès' },
        }],
      }), { status: 200 });
    });
    const weatherProvider = new MetNorwayProvider(
      'TP3-MeteoApi/1.0 contact@example.org',
      'https://met.test',
      async (input, init) => {
        weatherCalls += 1;
        const url = new URL(String(input));
        expect(url.searchParams.get('lat')).toBe('44.1279');
        expect(url.searchParams.get('lon')).toBe('4.0817');
        expect(new Headers(init?.headers).get('User-Agent')).toBe('TP3-MeteoApi/1.0 contact@example.org');
        return new Response(JSON.stringify({
          properties: {
            timeseries: [{
              time: '2025-06-10T14:00:00Z',
              data: { instant: { details: { air_temperature: 24.3 } } },
            }],
          },
        }), { status: 200 });
      },
    );
    const app = createApp(
      new GetWeatherByAddress(geocoder, weatherProvider),
      { execute: async () => { throw new Error('demo must not be used'); } },
    );

    const response = await request(app).get('/forecast').query({ address: 'Alès' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      address: 'Alès',
      latitude: 44.1279,
      longitude: 4.0817,
      hourly: [{ time: '2025-06-10T14:00:00Z', temperatureCelsius: 24.3 }],
    });
    expect(geocodingCalls).toBe(1);
    expect(weatherCalls).toBe(1);
  });
});