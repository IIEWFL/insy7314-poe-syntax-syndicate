import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateField, sanitizeInput } from '../utils/validation';
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaShieldAlt,
  FaIdCard,
  FaUserCircle,
  FaBolt
} from 'react-icons/fa';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [activeTab, setActiveTab] = useState('username');
  const [formData, setFormData] = useState({
    username: '',
    accountNumber: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Handle messages from registration or other pages
  useEffect(() => {
    if (location.state?.message) {
      setMessage({ type: 'success', text: location.state.message });
      
      // If account number is provided, switch to account number tab and pre-fill
      if (location.state.accountNumber) {
        setActiveTab('accountNumber');
        setFormData(prev => ({
          ...prev,
          accountNumber: location.state.accountNumber
        }));
      }
      
      // Clear the state to prevent message from persisting on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear general message
    if (message.text && message.type === 'danger') {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validate password
    const passwordError = validateField('password', formData.password);
    if (passwordError) newErrors.password = passwordError;
    
    // Validate username or account number based on active tab
    if (activeTab === 'username') {
      const usernameError = validateField('username', formData.username);
      if (usernameError) newErrors.username = usernameError;
    } else {
      const accountError = validateField('accountNumber', formData.accountNumber);
      if (accountError) newErrors.accountNumber = accountError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const credentials = {
        password: formData.password,
        ...(activeTab === 'username' 
          ? { username: formData.username }
          : { accountNumber: formData.accountNumber }
        )
      };

      const result = await login(credentials);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        // Check for specific "Account not found" message from backend
        if (result.message === 'Account not found') {
          setMessage({ type: 'danger', text: 'Account not found. Please check your credentials or register.' });
        } else {
          setMessage({ type: 'danger', text: result.message });
        }
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      setMessage({ type: 'danger', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="login-page" style={{
      paddingTop: '80px',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Container>
        <Row className="justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <Col lg={10} xl={9}>
            <Row className="g-0 shadow-lg rounded-4 overflow-hidden" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }}>
              {/* Left Side - Welcome Section */}
              <Col lg={6} className="d-none d-lg-block">
                <div
                  className="h-100 d-flex flex-column justify-content-center p-5 text-white position-relative"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                    minHeight: '650px'
                  }}
                >
                  <div className="position-relative" style={{ zIndex: 2 }}>
                    <div className="mb-4 animate__animated animate__fadeInDown">
                      <FaShieldAlt style={{ fontSize: '5rem', opacity: 0.95 }} />
                    </div>
                    <h2 className="display-5 fw-bold mb-4 animate__animated animate__fadeInLeft">
                      Secure Payment Portal
                    </h2>
                    <p className="lead mb-5 animate__animated animate__fadeInLeft" style={{
                      opacity: 0.95,
                      fontSize: '1.2rem',
                      animationDelay: '0.2s'
                    }}>
                      Your trusted gateway to international payments
                    </p>
                    <div className="animate__animated animate__fadeInUp" style={{ animationDelay: '0.4s' }}>
                      <div className="d-flex align-items-center mb-3 p-3 rounded" style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)'
                      }}>
                        <FaShieldAlt className="me-3" style={{ fontSize: '1.5rem' }} />
                        <span style={{ fontSize: '1.1rem' }}>Bank-grade encryption</span>
                      </div>
                      <div className="d-flex align-items-center mb-3 p-3 rounded" style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)'
                      }}>
                        <FaLock className="me-3" style={{ fontSize: '1.5rem' }} />
                        <span style={{ fontSize: '1.1rem' }}>SWIFT compliant</span>
                      </div>
                      <div className="d-flex align-items-center p-3 rounded" style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)'
                      }}>
                        <FaBolt className="me-3" style={{ fontSize: '1.5rem' }} />
                        <span style={{ fontSize: '1.1rem' }}>24/7 secure access</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated Background Pattern */}
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      opacity: 0.4,
                      zIndex: 1
                    }}
                  />
                </div>
              </Col>

              {/* Right Side - Login Form */}
              <Col lg={6}>
                <div className="p-5" style={{ minHeight: '650px' }}>
                  <div className="text-center mb-5">
                    <div className="mb-4 animate__animated animate__bounceIn">
                      <div style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto',
                        background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(255, 107, 53, 0.3)'
                      }}>
                        <FaSignInAlt className="text-white" style={{ fontSize: '2.5rem' }} />
                      </div>
                    </div>
                    <h2 className="fw-bold mb-2" style={{
                      fontSize: '2rem',
                      background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      Welcome Back
                    </h2>
                    <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                      Sign in to access your account
                    </p>
                  </div>

                  {/* Alert Messages */}
                  {message.text && (
                    <Alert variant={message.type} className="mb-4">
                      {message.text}
                    </Alert>
                  )}

                  <Form onSubmit={handleSubmit}>
                    {/* Login Method Tabs */}
                    <Tabs
                      activeKey={activeTab}
                      onSelect={handleTabChange}
                      className="mb-4 nav-justified"
                      fill
                    >
                      <Tab 
                        eventKey="username" 
                        title={
                          <span>
                            <FaUserCircle className="me-2" />
                            Username
                          </span>
                        }
                      >
                        <Form.Group className="mb-4 mt-3">
                          <Form.Label className="fw-medium">
                            <FaUser className="me-2 text-primary-orange" />
                            Username
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="form-control-custom"
                            placeholder="Enter your username"
                            isInvalid={!!errors.username}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.username}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Tab>
                      
                      <Tab 
                        eventKey="accountNumber" 
                        title={
                          <span>
                            <FaIdCard className="me-2" />
                            Account Number
                          </span>
                        }
                      >
                        <Form.Group className="mb-4 mt-3">
                          <Form.Label className="fw-medium">
                            <FaIdCard className="me-2 text-primary-orange" />
                            Account Number
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="accountNumber"
                            value={formData.accountNumber}
                            onChange={handleInputChange}
                            className="form-control-custom"
                            placeholder="Enter your account number"
                            isInvalid={!!errors.accountNumber}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.accountNumber}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Tab>
                    </Tabs>

                    {/* Password Field */}
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-medium">
                        <FaLock className="me-2 text-primary-orange" />
                        Password
                      </Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="form-control-custom pe-5"
                          placeholder="Enter your password"
                          isInvalid={!!errors.password}
                        />
                        <Button
                          variant="link"
                          className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ zIndex: 10 }}
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </Button>
                      </div>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading}
                      className="btn-primary-orange w-100 py-3 mb-4"
                      style={{ fontSize: '1.1rem' }}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                      {!loading && <FaSignInAlt className="ms-2" />}
                    </Button>
                  </Form>

                  {/* Footer Note */}
                  <div className="text-center pt-4 mt-4 border-top">
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                      <FaShieldAlt className="me-2" />
                      Protected by enterprise-grade security
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
