import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { GetWeatherByAddress } from '../src/application/get-weather';
import { createApp } from '../src/adapters/inbound/http/app';

describe('GET /weather', () => {
  it('returns the forecast for a postal address', async () => {
    const useCase = new GetWeatherByAddress(
      { geocode: async () => ({ latitude: 48.85, longitude: 2.35, displayName: 'Paris, France' }) },
      { forecast: async (coordinates) => ({ ...coordinates, timezone: 'Europe/Paris', hourly: { shortwave_radiation: [100] } }) },
    );

    const response = await request(createApp(useCase)).get('/weather').query({ address: 'Paris' });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ address: 'Paris, France', latitude: 48.85, longitude: 2.35 });
  });

  it('rejects a missing address', async () => {
    const useCase = new GetWeatherByAddress({ geocode: async () => null }, { forecast: async () => { throw new Error(); } });

    const response = await request(createApp(useCase)).get('/weather');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Query parameter "address" is required' });
  });

  it('serves the OpenAPI specification', async () => {
    const useCase = new GetWeatherByAddress({ geocode: async () => null }, { forecast: async () => { throw new Error(); } });

    const response = await request(createApp(useCase)).get('/docs.json');

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe('3.0.3');
    expect(response.body.paths['/weather'].get.parameters[0].name).toBe('address');
  });
});