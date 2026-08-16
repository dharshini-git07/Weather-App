import React, { useState } from 'react';
import { Search } from 'lucide-react';

const POPULAR_CITIES = ['Chennai', 'Mumbai', 'London', 'New York', 'Tokyo', 'Paris', 'Sydney'];

const SearchBar = ({ onSearch, loading, unit, onToggleUnit, currentCity }) => {
  const [inputCity, setInputCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;
    onSearch(inputCity);
  };

  const handleChipClick = (city) => {
    if (loading) return;
    setInputCity(city);
    onSearch(city);
  };

  return (
    <div className="search-section">
      <div className="search-bar-wrapper">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <Search className="search-input-icon" size={20} />
            <input
              type="text"
              className="city-input"
              value={inputCity}
              onChange={(e) => setInputCity(e.target.value)}
              placeholder="Enter city name..."
              disabled={loading}
              aria-label="City name search"
            />
          </div>

          <button
            type="submit"
            className="search-btn"
            disabled={loading}
            aria-label="Search city weather"
          >
            {loading ? (
              <span className="btn-loading-text">Searching...</span>
            ) : (
              <>
                <Search size={18} />
                <span>Search</span>
              </>
            )}
          </button>
        </form>

        {/* Temperature Unit Toggle Button */}
        <div className="unit-toggle-container">
          <button
            type="button"
            className={`unit-toggle-btn ${unit === 'C' ? 'active' : ''}`}
            onClick={() => onToggleUnit('C')}
            title="Display temperature in Celsius (°C)"
            aria-label="Celsius"
          >
            °C
          </button>
          <span className="unit-divider">|</span>
          <button
            type="button"
            className={`unit-toggle-btn ${unit === 'F' ? 'active' : ''}`}
            onClick={() => onToggleUnit('F')}
            title="Display temperature in Fahrenheit (°F)"
            aria-label="Fahrenheit"
          >
            °F
          </button>
        </div>
      </div>

      {/* Quick Select City Chips */}
      <div className="popular-cities">
        <span className="chips-label">Popular:</span>
        <div className="city-chips-list">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              className={`city-chip ${currentCity?.toLowerCase() === city.toLowerCase() ? 'active-chip' : ''}`}
              onClick={() => handleChipClick(city)}
              disabled={loading}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
