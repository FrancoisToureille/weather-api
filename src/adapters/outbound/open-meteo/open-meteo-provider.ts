import { z } from 'zod';
import { Coordinates, WeatherForecast } from '../../../domain/weather';
import { WeatherProvider } from '../../../domain/ports/weather-provider';

const forecastSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  hourly: z.record(z.string(), z.unknown()),
});

export class OpenMeteoProvider implements WeatherProvider {
  constructor(
    private readonly baseUrl = 'https://api.open-meteo.com',
    private readonly fetchFn: typeof fetch = fetch,
  ) {}

  async forecast({ latitude, longitude }: Coordinates): Promise<WeatherForecast> {
    const url = new URL('/v1/forecast', this.baseUrl);
    url.searchParams.set('latitude', String(latitude));
    url.searchParams.set('longitude', String(longitude));
    url.searchParams.set('hourly', 'shortwave_radiation');

    const response = await this.fetchFn(url);

    if (!response.ok) {
      throw new Error(`Open-Meteo request failed with status ${response.status}`);
    }

    return forecastSchema.parse(await response.json());
  }
}