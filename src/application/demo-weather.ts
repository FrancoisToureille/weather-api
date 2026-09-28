import { WeatherForecast } from '../domain/weather';

export class DemoWeather {
  async execute(address: string): Promise<WeatherForecast & { address: string }> {
    return {
      address,
      latitude: 44.1279,
      longitude: 4.0817,
      hourly: [{
        time: '2025-06-10T14:00:00Z',
        temperatureCelsius: 24.3,
      }],
    };
  }
}