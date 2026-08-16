import React from 'react';
import { Calendar, Sun, Cloud, CloudRain, CloudDrizzle, CloudLightning, Snowflake, CloudFog } from 'lucide-react';
import { formatTemperature, formatDayName, getWeatherCategory, capitalizeWords } from '../utils/weatherUtils';

const getSmallWeatherIcon = (category) => {
  switch (category) {
    case 'Clear':
      return <Sun size={26} className="forecast-icon sun" />;
    case 'Clouds':
      return <Cloud size={26} className="forecast-icon cloud" />;
    case 'Rain':
      return <CloudRain size={26} className="forecast-icon rain" />;
    case 'Drizzle':
      return <CloudDrizzle size={26} className="forecast-icon drizzle" />;
    case 'Thunderstorm':
      return <CloudLightning size={26} className="forecast-icon storm" />;
    case 'Snow':
      return <Snowflake size={26} className="forecast-icon snow" />;
    case 'Mist':
      return <CloudFog size={26} className="forecast-icon mist" />;
    default:
      return <Sun size={26} className="forecast-icon" />;
  }
};

const ForecastCard = ({ forecast, unit }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="forecast-section fade-in">
      <h3 className="section-title">
        <Calendar size={18} /> 5-Day Weather Forecast
      </h3>

      <div className="forecast-scroll-wrapper">
        <div className="forecast-grid">
          {forecast.map((item, index) => {
            const category = getWeatherCategory(item.condition);
            const dayName = formatDayName(item.dt || item.dateStr);

            return (
              <div key={item.dt || index} className="forecast-item-card glass-card">
                <div className="forecast-day-header">
                  <span className="forecast-day-name">{dayName}</span>
                  <span className="forecast-date-sub">{item.dateStr.slice(5)}</span>
                </div>

                <div className="forecast-icon-box">
                  {getSmallWeatherIcon(category)}
                </div>

                <div className="forecast-condition-name">
                  {capitalizeWords(item.condition)}
                </div>

                <div className="forecast-temp-main">
                  {formatTemperature(item.temp, unit)}
                </div>

                <div className="forecast-range">
                  <span className="temp-high">{formatTemperature(item.tempMax, unit)}</span>
                  <span className="temp-slash">/</span>
                  <span className="temp-low">{formatTemperature(item.tempMin, unit)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ForecastCard;
