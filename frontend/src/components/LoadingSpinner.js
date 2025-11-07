import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <Spinner 
        animation="border" 
        variant="primary" 
        size={size}
        className="mb-3"
        style={{ color: 'var(--primary-orange)' }}
      />
      <p className="text-muted mb-0">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
