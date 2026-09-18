export type GeocoderProvider = 'nominatim' | 'ban';
export type WeatherProviderName = 'open-meteo' | 'met-norway';

export function getConfig(env: NodeJS.ProcessEnv = process.env) {
  const geocoder = (env.GEOCODER_PROVIDER ?? 'nominatim') as GeocoderProvider;
  const weather = (env.WEATHER_PROVIDER ?? 'open-meteo') as WeatherProviderName;

  if (!['nominatim', 'ban'].includes(geocoder)) {
    throw new Error(`Unsupported GEOCODER_PROVIDER: ${geocoder}`);
  }
  if (!['open-meteo', 'met-norway'].includes(weather)) {
    throw new Error(`Unsupported WEATHER_PROVIDER: ${weather}`);
  }

  return {
    geocoder,
    weather,
    metNorwayUserAgent: env.MET_NORWAY_USER_AGENT ?? '',
  };
}