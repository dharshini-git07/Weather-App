import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Fetching weather...' }) => {
  return (
    <div className="loading-container glass-card fade-in" role="status">
      <div className="spinner-wrapper">
        <Loader2 className="loading-spinner" size={48} />
      </div>
      <p className="loading-text">{message}</p>
      <span className="loading-subtext">Connecting to real-time weather service...</span>
    </div>
  );
};

export default Loading;
