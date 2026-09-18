import { describe } from 'vitest';
import { BanGeocoder } from '../src/adapters/outbound/ban/ban-geocoder';
import { NominatimGeocoder } from '../src/adapters/outbound/nominatim/nominatim-geocoder';
import { MetNorwayProvider } from '../src/adapters/outbound/met-norway/met-norway-provider';
import { OpenMeteoProvider } from '../src/adapters/outbound/open-meteo/open-meteo-provider';
import { geocoderContract } from './contracts/geocoder.contract';
import { weatherProviderContract } from './contracts/weather-provider.contract';

const banResponse = {
  features: [{ geometry: { coordinates: [4.08, 44.12] }, properties: { label: 'Alès, France' } }],
};
const nominatimResponse = [{ lat: '44.12', lon: '4.08', display_name: 'Alès, France' }];
const openMeteoResponse = {
  latitude: 44.12,
  longitude: 4.08,
  timezone: 'GMT',
  hourly: { time: ['2026-09-18T12:00'], shortwave_radiation: [700] },
};
const metNorwayResponse = {
  properties: {
    timeseries: [{
      time: '2026-09-18T12:00:00Z',
      data: { instant: { details: { air_temperature: 20 } } },
    }],
  },
};

describe.each([
  ['BAN', (fetchFn: typeof fetch) => new BanGeocoder('https://ban.test', fetchFn), banResponse],
  ['Nominatim', (fetchFn: typeof fetch) => new NominatimGeocoder('https://nominatim.test', fetchFn), nominatimResponse],
])('%s geocoder contract', (_name, factory, response) => {
  geocoderContract(factory, response);
});

describe.each([
  ['MET Norway', (fetchFn: typeof fetch) => new MetNorwayProvider('TP2-MeteoApi/1.0 contact@example.com', 'https://met.test', fetchFn), metNorwayResponse],
  ['Open-Meteo', (fetchFn: typeof fetch) => new OpenMeteoProvider('https://open-meteo.test', fetchFn), openMeteoResponse],
])('%s weather provider contract', (_name, factory, response) => {
  weatherProviderContract(factory, response);
});