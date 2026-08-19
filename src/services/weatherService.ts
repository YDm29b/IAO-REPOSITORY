import { OBSERVATORY_CONFIG } from '../config/observatory';
import { WeatherData } from '../types';

const CACHE_KEY = 'iao_weather_cache_v1';
const CACHE_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface CachedPayload {
  timestamp: number;
  data: WeatherData;
}

export function getWeatherConditionDescription(code: number): string {
  switch (code) {
    case 0:
      return 'Clear Sky';
    case 1:
      return 'Mainly Clear';
    case 2:
      return 'Partly Cloudy';
    case 3:
      return 'Overcast';
    case 45:
    case 48:
      return 'Fog / Mist';
    case 51:
    case 53:
    case 55:
      return 'Light Drizzle';
    case 61:
    case 63:
    case 65:
      return 'Rain';
    case 71:
    case 73:
    case 75:
      return 'Snow Fall';
    case 80:
    case 81:
    case 82:
      return 'Rain Showers';
    case 95:
    case 96:
    case 99:
      return 'Thunderstorm';
    default:
      return 'Variable Sky';
  }
}

export async function fetchLiveObservatoryWeather(): Promise<WeatherData> {
  // Check local cache first
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const parsed: CachedPayload = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < CACHE_DURATION_MS) {
        return parsed.data;
      }
    }
  } catch (e) {
    // Ignore storage parse errors
  }

  const { latitude, longitude } = OBSERVATORY_CONFIG.coordinates;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,cloud_cover,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`;

  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Open-Meteo returned status ${response.status}`);
  }

  const json = await response.json();
  const current = json.current;

  if (!current) {
    throw new Error('Invalid Open-Meteo response structure');
  }

  const temp = Math.round(current.temperature_2m * 10) / 10;
  const cloudCover = Math.round(current.cloud_cover);
  const windSpeed = Math.round(current.wind_speed_10m * 10) / 10;
  const weatherCode = current.weather_code ?? 0;
  const humidity = current.relative_humidity_2m;
  const windDirection = current.wind_direction_10m;

  const conditionText = getWeatherConditionDescription(weatherCode);

  let isSessionViable = false;
  let viabilityNote = 'Observing session conditions poor';

  if (cloudCover <= 25 && weatherCode <= 2 && windSpeed < 25) {
    isSessionViable = true;
    viabilityNote = 'Sessions possible tonight';
  } else if (cloudCover <= 55 && weatherCode <= 2) {
    isSessionViable = true;
    viabilityNote = 'Partial observing window';
  } else if (cloudCover > 55) {
    isSessionViable = false;
    viabilityNote = 'High cloud cover';
  } else if (weatherCode >= 50) {
    isSessionViable = false;
    viabilityNote = 'Precipitation expected';
  }

  const weatherData: WeatherData = {
    temperature: temp,
    cloudCover,
    windSpeed,
    windDirection,
    humidity,
    weatherCode,
    conditionText,
    isSessionViable,
    viabilityNote,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sourceUrl: 'https://open-meteo.com/',
  };

  // Cache response
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data: weatherData,
      })
    );
  } catch (e) {
    // Ignore storage write errors
  }

  return weatherData;
}
