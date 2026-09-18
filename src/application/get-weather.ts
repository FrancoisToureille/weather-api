import { WeatherForecast } from '../domain/weather';
import { Geocoder } from '../domain/ports/geocoder';
import { WeatherProvider } from '../domain/ports/weather-provider';

export class AddressNotFoundError extends Error {
  constructor(address: string) {
    super(`No location found for address: ${address}`);
    this.name = 'AddressNotFoundError';
  }
}

export class GetWeatherByAddress {
  constructor(
    private readonly geocoder: Geocoder,
    private readonly weatherProvider: WeatherProvider,
  ) {}

  async execute(address: string): Promise<WeatherForecast & { address: string }> {
    const location = await this.geocoder.geocode(address);

    if (!location) {
      throw new AddressNotFoundError(address);
    }

    const forecast = await this.weatherProvider.forecast(location);

    return { address: location.displayName, ...forecast };
  }
}