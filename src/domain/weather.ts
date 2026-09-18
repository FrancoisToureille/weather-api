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
  timezone: string;
  hourly: Record<string, unknown>;
}

export interface Geocoder {
  geocode(address: string): Promise<GeocodedLocation | null>;
}

export interface WeatherProvider {
  forecast(coordinates: Coordinates): Promise<WeatherForecast>;
}