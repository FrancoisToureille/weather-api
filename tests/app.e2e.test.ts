import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { GetWeatherByAddress } from '../src/application/get-weather';
import { createApp } from '../src/adapters/inbound/http/app';
import { DemoWeather } from '../src/application/demo-weather';

describe('GET /weather', () => {
  it('returns the forecast for a postal address', async () => {
    const useCase = new GetWeatherByAddress(
      { geocode: async () => ({ latitude: 48.85, longitude: 2.35, displayName: 'Paris, France' }) },
      { forecast: async (coordinates) => ({ ...coordinates, hourly: [{ time: '2025-06-10T14:00:00Z', temperatureCelsius: 24.3 }] }) },
    );

    const response = await request(createApp(useCase, new DemoWeather())).get('/weather').query({ address: 'Paris' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ address: 'Paris, France', latitude: 48.85, longitude: 2.35, hourly: [{ time: '2025-06-10T14:00:00Z', temperatureCelsius: 24.3 }] });
  });

  it('rejects a missing address', async () => {
    const useCase = new GetWeatherByAddress({ geocode: async () => null }, { forecast: async () => { throw new Error(); } });

    const response = await request(createApp(useCase, new DemoWeather())).get('/weather');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Query parameter "address" is required' });
  });

  it('serves the OpenAPI specification', async () => {
    const useCase = new GetWeatherByAddress({ geocode: async () => null }, { forecast: async () => { throw new Error(); } });

    const response = await request(createApp(useCase, new DemoWeather())).get('/docs.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.3');
    expect(response.body.paths['/forecast'].get.parameters[0].name).toBe('address');
  });

  it('returns demo data without calling external dependencies', async () => {
    const useCase = new GetWeatherByAddress(
      { geocode: async () => { throw new Error('geocoder must not be called'); } },
      { forecast: async () => { throw new Error('weather provider must not be called'); } },
    );

    const response = await request(createApp(useCase, new DemoWeather())).get('/forecast')
      .query({ address: 'Alès', demo: 'true' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      address: 'Alès', latitude: 44.1279, longitude: 4.0817,
      hourly: [{ time: '2025-06-10T14:00:00Z', temperatureCelsius: 24.3 }],
    });
  });
});