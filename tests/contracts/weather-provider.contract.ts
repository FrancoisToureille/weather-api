import { expect, it } from 'vitest';
import { WeatherProvider } from '../../src/domain/ports/weather-provider';

export function weatherProviderContract(createProvider: (fetchFn: typeof fetch) => WeatherProvider, validResponse: object) {
  it('returns a normalized hourly forecast', async () => {
    const provider = createProvider(async () => new Response(JSON.stringify(validResponse), { status: 200 }));

    await expect(provider.forecast({ latitude: 44.12, longitude: 4.08 })).resolves.toMatchObject({
      latitude: 44.12,
      longitude: 4.08,
      timezone: expect.any(String),
      hourly: expect.any(Object),
    });
  });

  it('propagates provider errors', async () => {
    const provider = createProvider(async () => new Response('unavailable', { status: 503 }));

    await expect(provider.forecast({ latitude: 44.12, longitude: 4.08 })).rejects.toThrow();
  });
}