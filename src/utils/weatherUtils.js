/**
 * Weather Utility Functions
 */

/**
 * Converts Celsius temperature to Fahrenheit.
 * Formula: °F = (°C × 9/5) + 32
 * @param {number} celsius - Temperature in Celsius
 * @returns {number} Temperature in Fahrenheit
 */
export const celsiusToFahrenheit = (celsius) => {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return 0;
  return Math.round((celsius * 9) / 5 + 32);
};

/**
 * Formats temperature according to current unit selection ('C' or 'F').
 * @param {number} tempInCelsius - Base temperature in Celsius
 * @param {string} unit - 'C' or 'F'
 * @returns {string} Formatted string with symbol (e.g., "32°C" or "90°F")
 */
export const formatTemperature = (tempInCelsius, unit = 'C') => {
  if (tempInCelsius === null || tempInCelsius === undefined || isNaN(tempInCelsius)) {
    return `--°${unit}`;
  }

  const value = unit === 'F' ? celsiusToFahrenheit(tempInCelsius) : Math.round(tempInCelsius);
  return `${value}°${unit}`;
};

/**
 * Converts wind direction in degrees to a compass cardinal direction string.
 * @param {number} degrees - Direction in degrees (0 - 360)
 * @returns {string} Direction string (e.g. "N", "NE", "SW")
 */
export const getWindDirection = (degrees) => {
  if (degrees === null || degrees === undefined) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degrees % 360) / 22.5);
  return directions[index % 16];
};

/**
 * Formats a Unix timestamp (seconds) into a readable time string (e.g. "06:45 AM").
 * Takes optional timezone offset in seconds from UTC.
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {number} timezoneOffset - Timezone offset in seconds from UTC
 * @returns {string} Formatted local time
 */
export const formatUnixTime = (timestamp, timezoneOffset = 0) => {
  if (!timestamp) return '--:--';
  // Create Date object adjusting for target timezone offset
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  });
};

/**
 * Formats a date or timestamp into a short day name (e.g., "Mon", "Tue").
 * @param {number|string} dateInput - Unix timestamp or ISO date string
 * @returns {string} Short day string
 */
export const formatDayName = (dateInput) => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'number' ? new Date(dateInput * 1000) : new Date(dateInput);
  
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

/**
 * Normalizes OpenWeatherMap condition strings into clean standard categories.
 * @param {string} mainCondition - Main condition from weather API (e.g. "Clouds", "Rain")
 * @returns {string} Normalized condition category string
 */
export const getWeatherCategory = (mainCondition) => {
  if (!mainCondition) return 'Clear';
  const lower = mainCondition.toLowerCase();

  if (lower.includes('clear') || lower.includes('sun')) return 'Clear';
  if (lower.includes('cloud')) return 'Clouds';
  if (lower.includes('rain')) return 'Rain';
  if (lower.includes('drizzle')) return 'Drizzle';
  if (lower.includes('thunder') || lower.includes('storm')) return 'Thunderstorm';
  if (lower.includes('snow') || lower.includes('sleet') || lower.includes('ice')) return 'Snow';
  if (
    lower.includes('mist') ||
    lower.includes('fog') ||
    lower.includes('haze') ||
    lower.includes('smoke') ||
    lower.includes('dust') ||
    lower.includes('ash') ||
    lower.includes('squall') ||
    lower.includes('tornado')
  ) {
    return 'Mist';
  }

  return 'Clear';
};

/**
 * Capitalizes the first letter of each word in a string (e.g., "clear sky" -> "Clear Sky")
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
