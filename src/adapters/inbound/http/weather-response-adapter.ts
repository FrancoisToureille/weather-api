import { WeatherForecast } from '../../../domain/weather';

export interface WeatherHttpResponse {
  address: string;
  latitude: number;
  longitude: number;
  hourly: WeatherForecast['hourly'];
}

export function toWeatherHttpResponse(
  forecast: WeatherForecast & { address: string },
): WeatherHttpResponse {
  return {
    address: forecast.address,
    latitude: forecast.latitude,
    longitude: forecast.longitude,
    hourly: forecast.hourly,
  };
}