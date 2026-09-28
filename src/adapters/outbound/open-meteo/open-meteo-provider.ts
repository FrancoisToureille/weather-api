import { z } from 'zod';
import { Coordinates, HourlyForecast, WeatherForecast } from '../../../domain/weather';
import { WeatherProvider } from '../../../domain/ports/weather-provider';

const forecastSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  hourly: z.object({
    time: z.array(z.string()),
    temperature_2m: z.array(z.number()),
  }),
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
    url.searchParams.set('hourly', 'temperature_2m');

    const response = await this.fetchFn(url);

    if (!response.ok) {
      throw new Error(`Open-Meteo request failed with status ${response.status}`);
    }

    const forecast = forecastSchema.parse(await response.json());
    const hourly: HourlyForecast[] = forecast.hourly.time.map((time, index) => ({
      time,
      temperatureCelsius: forecast.hourly.temperature_2m[index],
    }));

    return { latitude, longitude, hourly };
  }
}