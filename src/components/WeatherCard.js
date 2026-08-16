import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  Snowflake,
  CloudFog,
  MapPin,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { formatTemperature, capitalizeWords, getWeatherCategory, formatUnixTime } from '../utils/weatherUtils';

/**
 * Returns appropriate Lucide icon component based on weather category
 */
const getWeatherIconComponent = (category) => {
  switch (category) {
    case 'Clear':
      return <Sun className="weather-svg-icon sun-spin" size={80} />;
    case 'Clouds':
      return <Cloud className="weather-svg-icon cloud-float" size={80} />;
    case 'Rain':
      return <CloudRain className="weather-svg-icon rain-bounce" size={80} />;
    case 'Drizzle':
      return <CloudDrizzle className="weather-svg-icon drizzle-anim" size={80} />;
    case 'Thunderstorm':
      return <CloudLightning className="weather-svg-icon storm-flash" size={80} />;
    case 'Snow':
      return <Snowflake className="weather-svg-icon snow-pulse" size={80} />;
    case 'Mist':
      return <CloudFog className="weather-svg-icon fog-drift" size={80} />;
    default:
      return <Sun className="weather-svg-icon" size={80} />;
  }
};

/**
 * WeatherCard Component
 * Prominent weather card displaying city, country, temperature, feels like, min/max, and condition.
 */
const WeatherCard = ({ weather, unit }) => {
  if (!weather) return null;

  const {
    cityName,
    country,
    temp,
    feelsLike,
    tempMin,
    tempMax,
    condition,
    description,
    timestamp,
    timezone
  } = weather;

  const category = getWeatherCategory(condition);

  return (
    <div className="weather-card glass-card fade-in">
      <div className="card-top">
        <div className="location-info">
          <div className="city-row">
            <MapPin size={22} className="pin-icon" />
            <h2 className="city-name">{cityName}</h2>
            {country && <span className="country-code">{country}</span>}
          </div>
          <p className="last-updated">
            Updated: {formatUnixTime(timestamp, timezone)}
          </p>
        </div>

        <div className="condition-badge-wrapper">
          <span className={`condition-chip chip-${category.toLowerCase()}`}>
            {condition}
          </span>
        </div>
      </div>

      <div className="card-main-content">
        <div className="visual-icon-container">
          {getWeatherIconComponent(category)}
        </div>

        <div className="temperature-primary-display">
          <span className="main-temp-number">
            {formatTemperature(temp, unit)}
          </span>
          <p className="condition-desc">
            {capitalizeWords(description || condition)}
          </p>
        </div>
      </div>

      <div className="card-footer-stats">
        <div className="stat-pill feels-like">
          <span className="pill-label">Feels like</span>
          <span className="pill-val">{formatTemperature(feelsLike, unit)}</span>
        </div>

        <div className="stat-pill high-low">
          <div className="hl-item">
            <TrendingUp size={14} className="hl-icon high" />
            <span className="hl-label">H:</span>
            <span className="hl-val">{formatTemperature(tempMax, unit)}</span>
          </div>
          <div className="hl-item">
            <TrendingDown size={14} className="hl-icon low" />
            <span className="hl-label">L:</span>
            <span className="hl-val">{formatTemperature(tempMin, unit)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
