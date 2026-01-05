import React from 'react';

export const ErrorMessage = ({ message, className = '' }) => {
  return (
    <div className={`text-red-600 text-sm ${className}`}>
      {message}
    </div>
  );
};