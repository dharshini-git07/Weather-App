import React from 'react';
import { Droplets, Wind, Gauge, Eye, Sunrise, Sunset, Compass } from 'lucide-react';
import { getWindDirection, formatUnixTime } from '../utils/weatherUtils';

/**
 * WeatherDetails Component
 * Displays grid of 6 detailed weather metrics: Humidity, Wind, Pressure, Visibility, Sunrise, Sunset.
 */
const WeatherDetails = ({ weather }) => {
  if (!weather) return null;

  const {
    humidity,
    windSpeed,
    windDeg,
    pressure,
    visibility,
    sunrise,
    sunset,
    timezone
  } = weather;

  const windDirStr = getWindDirection(windDeg);

  const metrics = [
    {
      id: 'humidity',
      label: 'Humidity',
      value: humidity !== null && humidity !== undefined ? `${humidity}%` : 'N/A',
      icon: <Droplets className="metric-icon humidity-icon" size={24} />,
      subtext: humidity > 70 ? 'High Moisture' : humidity < 30 ? 'Dry Air' : 'Optimal'
    },
    {
      id: 'wind',
      label: 'Wind Speed',
      value: windSpeed !== null && windSpeed !== undefined ? `${windSpeed} m/s` : 'N/A',
      icon: <Wind className="metric-icon wind-icon" size={24} />,
      subtext: windDirStr !== 'N/A' ? `${windDirStr} (${windDeg}°)` : 'Gentle'
    },
    {
      id: 'pressure',
      label: 'Pressure',
      value: pressure !== null && pressure !== undefined ? `${pressure} hPa` : 'N/A',
      icon: <Gauge className="metric-icon pressure-icon" size={24} />,
      subtext: pressure > 1013 ? 'High Pressure' : 'Normal Atmosphere'
    },
    {
      id: 'visibility',
      label: 'Visibility',
      value: visibility !== null && visibility !== undefined ? `${visibility} km` : 'N/A',
      icon: <Eye className="metric-icon visibility-icon" size={24} />,
      subtext: visibility >= 10 ? 'Clear Vision' : 'Reduced'
    },
    {
      id: 'sunrise',
      label: 'Sunrise',
      value: formatUnixTime(sunrise, timezone),
      icon: <Sunrise className="metric-icon sunrise-icon" size={24} />,
      subtext: 'Dawn'
    },
    {
      id: 'sunset',
      label: 'Sunset',
      value: formatUnixTime(sunset, timezone),
      icon: <Sunset className="metric-icon sunset-icon" size={24} />,
      subtext: 'Dusk'
    }
  ];

  return (
    <div className="weather-details-section fade-in">
      <h3 className="section-title">
        <Compass size={18} /> Weather Metrics
      </h3>

      <div className="details-grid">
        {metrics.map((metric) => (
          <div key={metric.id} className="metric-card glass-card">
            <div className="metric-header">
              <div className="icon-wrapper">{metric.icon}</div>
              <span className="metric-label">{metric.label}</span>
            </div>
            <div className="metric-body">
              <span className="metric-value">{metric.value}</span>
              {metric.subtext && <span className="metric-subtext">{metric.subtext}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;
