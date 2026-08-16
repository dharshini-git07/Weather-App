import React from 'react';
import { SunMedium, Search, Compass, CloudRain } from 'lucide-react';

/**
 * InitialState Component
 * Centered hero graphic displayed before the user searches for any city.
 */
const InitialState = ({ onQuickSearch }) => {
  return (
    <div className="initial-state-container fade-in">
      <div className="hero-icon-group">
        <div className="hero-sun-glow"></div>
        <SunMedium className="hero-icon hero-sun" size={72} />
        <CloudRain className="hero-icon hero-cloud" size={48} />
      </div>

      <h2 className="initial-title">Check the Weather</h2>
      <p className="initial-subtitle">
        Search for a city to see its current weather conditions, multi-day forecast, and environmental details.
      </p>

      <div className="initial-features">
        <div className="feature-item" onClick={() => onQuickSearch('Chennai')}>
          <Search size={18} className="feature-icon" />
          <span>Real-time temperature</span>
        </div>
        <div className="feature-item" onClick={() => onQuickSearch('London')}>
          <Compass size={18} className="feature-icon" />
          <span>Wind, Humidity & Pressure</span>
        </div>
        <div className="feature-item" onClick={() => onQuickSearch('New York')}>
          <SunMedium size={18} className="feature-icon" />
          <span>5-Day Forecast projection</span>
        </div>
      </div>
    </div>
  );
};

export default InitialState;
