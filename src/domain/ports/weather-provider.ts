import { Coordinates, WeatherForecast } from '../weather';

export interface WeatherProvider {
  forecast(coordinates: Coordinates): Promise<WeatherForecast>;
}