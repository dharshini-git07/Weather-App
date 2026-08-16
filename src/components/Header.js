import React, { useState, useEffect } from 'react';
import { CloudSun, Clock, MapPin } from 'lucide-react';
import { getWeatherCategory } from '../utils/weatherUtils';

/**
 * Header Component
 * Displays application branding, live clock, and active weather condition badge.
 */
const Header = ({ weather }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const activeCategory = weather ? getWeatherCategory(weather.condition) : null;

  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <CloudSun className="brand-icon" size={32} />
        </div>
        <div className="brand-text">
          <h1 className="app-title">Weather Report</h1>
          <p className="app-subtitle">Real-time weather information</p>
        </div>
      </div>

      <div className="header-meta">
        {weather && (
          <div className="header-location-badge">
            <MapPin size={14} className="badge-icon" />
            <span className="location-text">
              {weather.cityName}{weather.country ? `, ${weather.country}` : ''}
            </span>
            <span className={`condition-tag tag-${activeCategory?.toLowerCase()}`}>
              {weather.condition}
            </span>
          </div>
        )}

        <div className="live-clock">
          <Clock size={15} className="clock-icon" />
          <span className="clock-time">{formattedTime}</span>
          <span className="clock-date">{formattedDate}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
