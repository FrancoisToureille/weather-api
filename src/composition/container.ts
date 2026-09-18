import { asClass, asFunction, createContainer, InjectionMode } from 'awilix';
import { GetWeatherByAddress } from '../application/get-weather';
import { BanGeocoder } from '../adapters/outbound/ban/ban-geocoder';
import { NominatimGeocoder } from '../adapters/outbound/nominatim/nominatim-geocoder';
import { MetNorwayProvider } from '../adapters/outbound/met-norway/met-norway-provider';
import { OpenMeteoProvider } from '../adapters/outbound/open-meteo/open-meteo-provider';
import { createApp } from '../adapters/inbound/http/app';
import { getConfig } from './config';

export function createApplicationContainer(env: NodeJS.ProcessEnv = process.env) {
  const container = createContainer({ injectionMode: InjectionMode.CLASSIC });
  const config = getConfig(env);

  container.register({
    geocoder: asFunction(() => config.geocoder === 'ban' ? new BanGeocoder() : new NominatimGeocoder()).singleton(),
    weatherProvider: asFunction(() => config.weather === 'met-norway'
      ? new MetNorwayProvider(config.metNorwayUserAgent)
      : new OpenMeteoProvider()).singleton(),
    getWeatherByAddress: asClass(GetWeatherByAddress).singleton(),
    app: asFunction(createApp).singleton(),
  });

  return container;
}