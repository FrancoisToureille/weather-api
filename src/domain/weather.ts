export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GeocodedLocation extends Coordinates {
  displayName: string;
}

export interface WeatherForecast {
  latitude: number;
  longitude: number;
  hourly: HourlyForecast[];
}

export interface HourlyForecast {
  time: string;
  temperatureCelsius: number;
}

export interface Geocoder {
  geocode(address: string): Promise<GeocodedLocation | null>;
}

export interface WeatherProvider {
  forecast(coordinates: Coordinates): Promise<WeatherForecast>;
}