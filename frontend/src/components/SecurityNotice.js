import React from 'react';
import { Alert } from 'react-bootstrap';
import { FaShieldAlt, FaLock, FaExclamationTriangle } from 'react-icons/fa';

const SecurityNotice = () => {
  return (
    <Alert variant="warning" className="border-0 shadow-sm mb-4">
      <div className="d-flex align-items-start">
        <FaShieldAlt className="text-warning me-3 mt-1" style={{ fontSize: '1.5rem' }} />
        <div>
          <Alert.Heading className="h6 mb-2">
            <FaLock className="me-2" />
            Security Notice
          </Alert.Heading>
          <p className="mb-2 small">
            This application implements multiple security layers:
          </p>
          <ul className="mb-2 small">
            <li><strong>Password Security:</strong> Bcrypt hashing with salt and pepper</li>
            <li><strong>Input Validation:</strong> Client and server-side RegEx whitelisting</li>
            <li><strong>SSL/TLS:</strong> All traffic encrypted with HTTPS</li>
            <li><strong>Attack Protection:</strong> Rate limiting, Helmet.js, CORS, and sanitization</li>
            <li><strong>Authentication:</strong> JWT tokens with secure session management</li>
          </ul>
          <p className="mb-0 small text-muted">
            <FaExclamationTriangle className="me-1" />
            For demonstration purposes only. In production, additional security measures would be implemented.
          </p>
        </div>
      </div>
    </Alert>
  );
};

export default SecurityNotice;
