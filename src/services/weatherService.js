import axios from 'axios';

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPEN_METEO_GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Gets the OpenWeatherMap API key from environment variables.
 * @returns {string|null} The API key if configured and valid string, otherwise null.
 */
const getApiKey = () => {
  const key = process.env.REACT_APP_WEATHER_API_KEY;
  if (!key || key.trim() === '' || key === 'YOUR_API_KEY') {
    return null;
  }
  return key.trim();
};

/**
 * Fetches current weather and 5-day forecast for a given city.
 * @param {string} city - Name of the city to search
 * @returns {Promise<Object>} Normalized weather data object
 */
export const fetchWeatherData = async (city) => {
  if (!city || !city.trim()) {
    throw new Error('Please enter a city name.');
  }

  const apiKey = getApiKey();

  // If OpenWeatherMap API key is missing, attempt Open-Meteo fallback for smooth demo,
  // but tag with isFallback: true so UI can show clear notification.
  if (!apiKey) {
    try {
      return await fetchOpenMeteoFallback(city.trim());
    } catch (fallbackError) {
      // If fallback also fails or user specifically wants key error message:
      const error = new Error('Weather API configuration is missing or invalid. Please check your .env file.');
      error.type = 'MISSING_API_KEY';
      throw error;
    }
  }

  try {
    const encodedCity = encodeURIComponent(city.trim());
    const weatherUrl = `${OPENWEATHER_BASE_URL}/weather?q=${encodedCity}&appid=${apiKey}&units=metric`;
    const forecastUrl = `${OPENWEATHER_BASE_URL}/forecast?q=${encodedCity}&appid=${apiKey}&units=metric`;

    // Fetch current weather and 5-day forecast concurrently using Axios
    const [weatherRes, forecastRes] = await Promise.all([
      axios.get(weatherUrl),
      axios.get(forecastUrl).catch(() => null) // Allow forecast failure without breaking main weather
    ]);

    const normalizedData = normalizeOpenWeatherData(weatherRes.data, forecastRes ? forecastRes.data : null);
    normalizedData.isFallback = false;
    return normalizedData;
  } catch (error) {
    handleAxiosError(error);
  }
};

/**
 * Handles Axios HTTP errors and throws user-friendly messages.
 * @param {Object} error - Axios error object
 */
const handleAxiosError = (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 404) {
      const err = new Error('City not found. Please check the spelling and try again.');
      err.type = 'NOT_FOUND';
      throw err;
    } else if (status === 401) {
      const err = new Error('Weather API configuration is missing or invalid. Please check your .env file.');
      err.type = 'MISSING_API_KEY';
      throw err;
    } else {
      const err = new Error(`API Error (${status}): ${error.response.data?.message || 'Unable to fetch weather data.'}`);
      err.type = 'API_ERROR';
      throw err;
    }
  } else if (error.request) {
    const err = new Error('Unable to connect to the weather service. Please try again.');
    err.type = 'NETWORK_ERROR';
    throw err;
  } else if (error.type) {
    throw error;
  } else {
    const err = new Error(error.message || 'An unexpected error occurred while fetching weather data.');
    err.type = 'UNKNOWN_ERROR';
    throw err;
  }
};

/**
 * Normalizes OpenWeatherMap API responses into clean standard weather object.
 * @param {Object} currentWeather - OpenWeatherMap current weather response
 * @param {Object|null} forecastData - OpenWeatherMap forecast response
 * @returns {Object} Normalized weather object
 */
const normalizeOpenWeatherData = (currentWeather, forecastData) => {
  const {
    name,
    sys: { country, sunrise, sunset } = {},
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure } = {},
    wind: { speed: windSpeed, deg: windDeg } = {},
    visibility,
    weather: [conditionObj = {}] = [],
    dt,
    timezone
  } = currentWeather;

  // Process 5-day forecast if available (OpenWeatherMap /forecast returns 40 3-hour entries)
  let processedForecast = [];
  if (forecastData && forecastData.list) {
    const dailyMap = {};
    forecastData.list.forEach((item) => {
      // Group forecast items by date string (YYYY-MM-DD)
      const dateStr = item.dt_txt.split(' ')[0];
      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = [];
      }
      dailyMap[dateStr].push(item);
    });

    // Extract one daily representative record (around mid-day 12:00:00 or average)
    processedForecast = Object.keys(dailyMap)
      .slice(0, 5)
      .map((dateStr) => {
        const items = dailyMap[dateStr];
        // Pick entry closest to 12:00
        const midItem = items.reduce((prev, curr) => {
          const prevHour = Math.abs(parseInt(prev.dt_txt.split(' ')[1].split(':')[0]) - 12);
          const currHour = Math.abs(parseInt(curr.dt_txt.split(' ')[1].split(':')[0]) - 12);
          return currHour < prevHour ? curr : prev;
        }, items[0]);

        // Calculate daily min & max temp
        const temps = items.map((i) => i.main.temp);
        const dayMin = Math.min(...temps);
        const dayMax = Math.max(...temps);

        return {
          dt: midItem.dt,
          dateStr: dateStr,
          temp: midItem.main.temp,
          tempMin: dayMin,
          tempMax: dayMax,
          condition: midItem.weather[0]?.main || 'Clear',
          description: midItem.weather[0]?.description || '',
          iconCode: midItem.weather[0]?.icon || '01d',
          humidity: midItem.main.humidity,
          windSpeed: midItem.wind?.speed || 0
        };
      });
  }

  return {
    cityName: name,
    country: country || '',
    temp: temp,
    feelsLike: feels_like,
    tempMin: temp_min,
    tempMax: temp_max,
    condition: conditionObj.main || 'Clear',
    description: conditionObj.description || '',
    iconCode: conditionObj.icon || '01d',
    humidity: humidity,
    pressure: pressure,
    windSpeed: windSpeed,
    windDeg: windDeg,
    visibility: visibility ? Math.round(visibility / 1000) : null, // Convert meters to km
    sunrise: sunrise,
    sunset: sunset,
    timestamp: dt,
    timezone: timezone || 0,
    forecast: processedForecast
  };
};

/**
 * Seamless fallback to Open-Meteo free API when no OpenWeatherMap key is configured.
 * @param {string} city - City name
 * @returns {Promise<Object>} Normalized weather data with fallback flag
 */
const fetchOpenMeteoFallback = async (city) => {
  const geoRes = await axios.get(`${OPEN_METEO_GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
  if (!geoRes.data.results || geoRes.data.results.length === 0) {
    const err = new Error('City not found. Please check the spelling and try again.');
    err.type = 'NOT_FOUND';
    throw err;
  }

  const location = geoRes.data.results[0];
  const { latitude, longitude, name, country } = location;

  const weatherRes = await axios.get(
    `${OPEN_METEO_WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
  );

  const current = weatherRes.data.current;
  const daily = weatherRes.data.daily;

  // Map WMO weather codes to OpenWeather condition names
  const conditionInfo = mapWmoCodeToCondition(current.weather_code);

  const forecast = (daily.time || []).slice(0, 5).map((time, idx) => {
    const dayCond = mapWmoCodeToCondition(daily.weather_code[idx]);
    return {
      dt: Math.floor(new Date(time).getTime() / 1000),
      dateStr: time,
      temp: (daily.temperature_2m_max[idx] + daily.temperature_2m_min[idx]) / 2,
      tempMin: daily.temperature_2m_min[idx],
      tempMax: daily.temperature_2m_max[idx],
      condition: dayCond.condition,
      description: dayCond.description,
      iconCode: dayCond.iconCode,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m
    };
  });

  return {
    cityName: name,
    country: country || '',
    temp: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    tempMin: daily.temperature_2m_min[0] || current.temperature_2m,
    tempMax: daily.temperature_2m_max[0] || current.temperature_2m,
    condition: conditionInfo.condition,
    description: conditionInfo.description,
    iconCode: conditionInfo.iconCode,
    humidity: current.relative_humidity_2m,
    pressure: Math.round(current.surface_pressure),
    windSpeed: current.wind_speed_10m,
    windDeg: current.wind_direction_10m,
    visibility: 10,
    sunrise: daily.sunrise ? Math.floor(new Date(daily.sunrise[0]).getTime() / 1000) : null,
    sunset: daily.sunset ? Math.floor(new Date(daily.sunset[0]).getTime() / 1000) : null,
    timestamp: Math.floor(Date.now() / 1000),
    timezone: weatherRes.data.utc_offset_seconds || 0,
    forecast: forecast,
    isFallback: true
  };
};

/**
 * Maps WMO code from Open-Meteo to standard condition format
 */
const mapWmoCodeToCondition = (code) => {
  if (code === 0) return { condition: 'Clear', description: 'clear sky', iconCode: '01d' };
  if (code === 1 || code === 2 || code === 3) return { condition: 'Clouds', description: 'partly cloudy', iconCode: '02d' };
  if (code === 45 || code === 48) return { condition: 'Mist', description: 'foggy', iconCode: '50d' };
  if (code >= 51 && code <= 67) return { condition: 'Rain', description: 'rain showers', iconCode: '10d' };
  if (code >= 71 && code <= 77) return { condition: 'Snow', description: 'snowfall', iconCode: '13d' };
  if (code >= 80 && code <= 82) return { condition: 'Rain', description: 'heavy rain', iconCode: '09d' };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', description: 'thunderstorm', iconCode: '11d' };
  return { condition: 'Clear', description: 'clear sky', iconCode: '01d' };
};
