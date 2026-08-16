import React from 'react';
import { AlertCircle, KeyRound, WifiOff, MapPinOff, RefreshCw } from 'lucide-react';

/**
 * ErrorMessage Component
 * Displays friendly user feedback alerts based on error type.
 */
const ErrorMessage = ({ error, onRetry }) => {
  if (!error) return null;

  // Determine appropriate icon and title based on message content
  let IconComponent = AlertCircle;
  let title = 'Search Issue';

  if (error.includes('.env') || error.includes('API key') || error.includes('configuration')) {
    IconComponent = KeyRound;
    title = 'API Key Configuration Required';
  } else if (error.includes('not found') || error.includes('spelling')) {
    IconComponent = MapPinOff;
    title = 'Location Not Found';
  } else if (error.includes('connect') || error.includes('network')) {
    IconComponent = WifiOff;
    title = 'Connection Error';
  }

  return (
    <div className="error-card glass-card fade-in" role="alert">
      <div className="error-icon-box">
        <IconComponent size={36} className="error-icon" />
      </div>

      <div className="error-content">
        <h3 className="error-title">{title}</h3>
        <p className="error-message-text">{error}</p>
      </div>

      {onRetry && (
        <button type="button" className="retry-btn" onClick={onRetry}>
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
