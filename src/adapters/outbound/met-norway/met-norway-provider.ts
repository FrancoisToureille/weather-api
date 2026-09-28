import { z } from 'zod';
import { WeatherProvider } from '../../../domain/ports/weather-provider';
import { Coordinates, WeatherForecast } from '../../../domain/weather';

const metNorwayResponseSchema = z.object({
  properties: z.object({
    timeseries: z.array(z.object({
      time: z.string(),
      data: z.object({
        instant: z.object({
          details: z.record(z.string(), z.unknown()),
        }),
        next_1_hours: z.object({
          details: z.record(z.string(), z.unknown()),
        }).optional(),
      }),
    })),
  }),
});

export class MetNorwayProvider implements WeatherProvider {
  constructor(
    private readonly userAgent: string,
    private readonly baseUrl = 'https://api.met.no',
    private readonly fetchFn: typeof fetch = fetch,
  ) {
    if (!userAgent.trim()) {
      throw new Error('MET_NORWAY_USER_AGENT must identify the application and a contact');
    }
  }

  async forecast({ latitude, longitude }: Coordinates): Promise<WeatherForecast> {
    const url = new URL('/weatherapi/locationforecast/2.0/compact', this.baseUrl);
    url.searchParams.set('lat', String(latitude));
    url.searchParams.set('lon', String(longitude));

    const response = await this.fetchFn(url, { headers: { 'User-Agent': this.userAgent } });
    if (!response.ok) {
      throw new Error(`MET Norway request failed with status ${response.status}`);
    }

    const { properties } = metNorwayResponseSchema.parse(await response.json());
    const hourly = properties.timeseries.map((point) => ({
      time: point.time,
      temperatureCelsius: Number(point.data.instant.details.air_temperature),
    }));

    return { latitude, longitude, hourly };
  }
}