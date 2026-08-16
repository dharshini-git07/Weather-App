import React, { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherDetails from './components/WeatherDetails';
import ForecastCard from './components/ForecastCard';
import DynamicBackground from './components/DynamicBackground';
import Loading from './components/Loading';
import ErrorMessage from './components/ErrorMessage';
import InitialState from './components/InitialState';
import { fetchWeatherData } from './services/weatherService';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');

  const handleSearch = async (targetCity) => {
    const searchTarget = targetCity !== undefined ? targetCity : city;

    if (!searchTarget || !searchTarget.trim()) {
      setError('Please enter a city name.');
      setWeather(null);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await fetchWeatherData(searchTarget.trim());
      setWeather(data);
      setCity(searchTarget.trim());
      setError('');
    } catch (err) {
      setWeather(null);
      setError(err.message || 'An error occurred while fetching weather data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUnit = (selectedUnit) => {
    setUnit(selectedUnit);
  };

  const handleRetry = () => {
    if (city) {
      handleSearch(city);
    } else {
      setError('');
    }
  };

  return (
    <div className="app-root">
      {/* Dynamic Visual Weather Atmosphere Background */}
      <DynamicBackground condition={weather?.condition || 'Clear'} />

      <main className="app-container">
        {/* Application Header */}
        <Header weather={weather} />

        {/* Search & Filter Controls */}
        <SearchBar
          onSearch={handleSearch}
          loading={loading}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          currentCity={city}
        />

        {/* Error Alert Display */}
        {error && !loading && (
          <ErrorMessage error={error} onRetry={city ? handleRetry : null} />
        )}

        {/* Loading Spinner State */}
        {loading && <Loading message={`Fetching weather for "${city || 'your city'}"...`} />}

        {/* Initial Empty State before search */}
        {!weather && !loading && !error && (
          <InitialState onQuickSearch={handleSearch} />
        )}

        {/* Main Weather Dashboard Output */}
        {weather && !loading && (
          <div className="dashboard-content fade-in">
            <div className="dashboard-top-row">
              <WeatherCard weather={weather} unit={unit} />
            </div>

            <WeatherDetails weather={weather} />

            <ForecastCard forecast={weather.forecast} unit={unit} />
          </div>
        )}

        {/* App Footer */}
        <footer className="app-footer">
          <p>© {new Date().getFullYear()} Weather Report App • Built with React & Axios</p>
        </footer>
      </main>
    </div>
  );
}

export default App;
