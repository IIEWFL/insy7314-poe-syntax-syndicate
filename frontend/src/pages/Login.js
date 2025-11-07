import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateField, sanitizeInput } from '../utils/validation';
import SecurityNotice from '../components/SecurityNotice';
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaShieldAlt,
  FaIdCard,
  FaUserCircle
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
    <div className="login-page" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={10} xl={8}>
            <Row className="g-0 shadow-lg rounded-4 overflow-hidden bg-white">
              {/* Left Side - Welcome Section */}
              <Col lg={6} className="d-none d-lg-block">
                <div 
                  className="h-100 d-flex flex-column justify-content-center p-5 text-white position-relative"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%)',
                    minHeight: '600px'
                  }}
                >
                  <div className="position-relative z-index-1">
                    <div className="mb-4">
                      <FaShieldAlt style={{ fontSize: '4rem', opacity: 0.9 }} />
                    </div>
                    <h2 className="display-6 fw-bold mb-4">Welcome Back!</h2>
                    <p className="lead mb-4" style={{ opacity: 0.9 }}>
                      Access your secure international payment portal
                    </p>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <FaShieldAlt className="me-2" />
                        Bank-grade security
                      </li>
                      <li className="mb-2">
                        <FaShieldAlt className="me-2" />
                        SWIFT compliant transactions
                      </li>
                      <li className="mb-2">
                        <FaShieldAlt className="me-2" />
                        24/7 secure access
                      </li>
                    </ul>
                  </div>
                  
                  {/* Background Pattern */}
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      opacity: 0.3
                    }}
                  />
                </div>
              </Col>

              {/* Right Side - Login Form */}
              <Col lg={6}>
                <div className="p-5" style={{ minHeight: '600px' }}>
                  <div className="text-center mb-4">
                    <div className="mb-3">
                      <FaSignInAlt className="text-primary-orange" style={{ fontSize: '3rem' }} />
                    </div>
                    <h2 className="fw-bold text-primary-orange mb-2">Sign In</h2>
                    <p className="text-muted">Access your secure payment portal</p>
                  </div>

                  {/* Security Notice */}
                  <SecurityNotice />

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

                  {/* Register Link */}
                  <div className="text-center pt-4 border-top">
                    <p className="text-muted mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-primary-orange fw-medium text-decoration-none">
                        Create one here
                      </Link>
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
