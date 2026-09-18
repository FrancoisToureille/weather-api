import { asClass, asFunction, createContainer, InjectionMode } from 'awilix';
import { GetWeatherByAddress } from '../application/get-weather';
import { NominatimGeocoder } from '../adapters/outbound/nominatim/nominatim-geocoder';
import { OpenMeteoProvider } from '../adapters/outbound/open-meteo/open-meteo-provider';
import { createApp } from '../adapters/inbound/http/app';

export function createApplicationContainer() {
  const container = createContainer({ injectionMode: InjectionMode.CLASSIC });

  container.register({
    geocoder: asClass(NominatimGeocoder).singleton(),
    weatherProvider: asClass(OpenMeteoProvider).singleton(),
    getWeatherByAddress: asClass(GetWeatherByAddress).singleton(),
    app: asFunction(createApp).singleton(),
  });

  return container;
}