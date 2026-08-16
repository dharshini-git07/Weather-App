import React from 'react';
import { getWeatherCategory } from '../utils/weatherUtils';

/**
 * DynamicBackground Component
 * Renders atmospheric background gradients and animated particle effects based on weather category.
 */
const DynamicBackground = ({ condition }) => {
  const category = getWeatherCategory(condition);
  const themeClass = `theme-${category.toLowerCase()}`;

  return (
    <div className={`dynamic-background ${themeClass}`}>
      {/* Ambient background glowing radial elements */}
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>
      <div className="bg-orb bg-orb-3"></div>

      {/* Atmospheric particle layer */}
      <div className="weather-particle-layer">
        {category === 'Rain' && (
          <div className="rain-particles">
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
            <span className="drop"></span>
          </div>
        )}
        {category === 'Snow' && (
          <div className="snow-particles">
            <span className="flake">❄</span>
            <span className="flake">❅</span>
            <span className="flake">❆</span>
          </div>
        )}
        {category === 'Thunderstorm' && <div className="lightning-flash"></div>}
      </div>

      <div className="bg-overlay"></div>
    </div>
  );
};

export default DynamicBackground;
