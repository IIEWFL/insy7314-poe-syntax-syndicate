import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, ProgressBar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { validateForm, sanitizeInput, getPasswordStrength } from '../utils/validation';
import SecurityNotice from '../components/SecurityNotice';
import {
  FaUser,
  FaIdCard,
  FaUserCircle,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaShieldAlt
} from 'react-icons/fa';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    idNumber: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateCurrentStep = () => {
    const stepErrors = validateForm(formData, currentStep);
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await register(formData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `${result.message} Your account number is: ${result.accountNumber}` 
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Registration successful! Please log in with your credentials.',
              accountNumber: result.accountNumber 
            }
          });
        }, 3000);
      } else {
        setMessage({ type: 'danger', text: result.message });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Personal Information';
      case 2: return 'Account Details';
      case 3: return 'Security Setup';
      default: return 'Registration';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 1: return <FaUser className="text-primary-orange" />;
      case 2: return <FaUserCircle className="text-primary-orange" />;
      case 3: return <FaShieldAlt className="text-primary-orange" />;
      default: return <FaUser className="text-primary-orange" />;
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="register-page" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8} xl={6}>
            <Card className="form-section shadow-lg border-0">
              <Card.Body className="p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3" style={{ fontSize: '3rem' }}>
                    {getStepIcon()}
                  </div>
                  <h2 className="fw-bold text-primary-orange mb-2">Create Your Account</h2>
                  <p className="text-muted">Step {currentStep} of 3: {getStepTitle()}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <ProgressBar 
                    now={(currentStep / 3) * 100} 
                    className="mb-2"
                    style={{ height: '8px', borderRadius: '4px' }}
                  />
                  <div className="d-flex justify-content-between small text-muted">
                    <span className={currentStep >= 1 ? 'text-primary-orange fw-medium' : ''}>Personal</span>
                    <span className={currentStep >= 2 ? 'text-primary-orange fw-medium' : ''}>Account</span>
                    <span className={currentStep >= 3 ? 'text-primary-orange fw-medium' : ''}>Security</span>
                  </div>
                </div>

                {/* Security Notice */}
                <SecurityNotice />

                {/* Alert Messages */}
                {message.text && (
                  <Alert variant={message.type} className="mb-4">
                    {message.type === 'success' && <FaCheckCircle className="me-2" />}
                    {message.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="fade-in">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          <FaUser className="me-2 text-primary-orange" />
                          Full Name
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="form-control-custom"
                          placeholder="Enter your full name"
                          isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Only letters, spaces, and hyphens allowed (2-60 characters)
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          <FaIdCard className="me-2 text-primary-orange" />
                          ID Number
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="idNumber"
                          value={formData.idNumber}
                          onChange={handleInputChange}
                          className="form-control-custom"
                          placeholder="Enter your ID number"
                          isInvalid={!!errors.idNumber}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.idNumber}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          Up to 13 digits only
                        </Form.Text>
                      </Form.Group>
                    </div>
                  )}

                  {/* Step 2: Account Details */}
                  {currentStep === 2 && (
                    <div className="fade-in">
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          <FaUserCircle className="me-2 text-primary-orange" />
                          Username
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          className="form-control-custom"
                          placeholder="Choose a username"
                          isInvalid={!!errors.username}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.username}
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                          3-20 characters: letters, numbers, and underscore only
                        </Form.Text>
                      </Form.Group>

                      <div className="text-center p-4 bg-light-orange rounded">
                        <FaCheckCircle className="text-primary-orange mb-2" style={{ fontSize: '2rem' }} />
                        <h5 className="text-primary-orange mb-2">Account Number</h5>
                        <p className="text-muted mb-0">
                          Your unique account number will be automatically generated after registration
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Security Setup */}
                  {currentStep === 3 && (
                    <div className="fade-in">
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
                            placeholder="Create a strong password"
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
                        
                        {/* Password Strength Indicator */}
                        {formData.password && (
                          <div className="mt-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small className="text-muted">Password Strength:</small>
                              <small style={{ color: passwordStrength.color, fontWeight: '600' }}>
                                {passwordStrength.text}
                              </small>
                            </div>
                            <ProgressBar 
                              now={(passwordStrength.score / 6) * 100}
                              style={{ height: '4px' }}
                              variant={passwordStrength.score < 3 ? 'danger' : passwordStrength.score < 5 ? 'warning' : 'success'}
                            />
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          <FaLock className="me-2 text-primary-orange" />
                          Confirm Password
                        </Form.Label>
                        <div className="position-relative">
                          <Form.Control
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="form-control-custom pe-5"
                            placeholder="Confirm your password"
                            isInvalid={!!errors.confirmPassword}
                          />
                          <Button
                            variant="link"
                            className="position-absolute end-0 top-50 translate-middle-y border-0 text-muted"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ zIndex: 10 }}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </div>
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between mt-5">
                    <div>
                      {currentStep > 1 && (
                        <Button
                          variant="outline-secondary"
                          onClick={prevStep}
                          className="px-4 py-2"
                        >
                          <FaArrowLeft className="me-2" />
                          Previous
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      {currentStep < 3 ? (
                        <Button
                          variant="primary"
                          onClick={nextStep}
                          className="btn-primary-orange px-4 py-2"
                        >
                          Next
                          <FaArrowRight className="ms-2" />
                        </Button>
                      ) : (
                        <Button
                          type="submit"
                          variant="primary"
                          disabled={loading}
                          className="btn-primary-orange px-5 py-2"
                        >
                          {loading ? 'Creating Account...' : 'Create Account'}
                          {!loading && <FaCheckCircle className="ms-2" />}
                        </Button>
                      )}
                    </div>
                  </div>
                </Form>

                {/* Login Link */}
                <div className="text-center mt-4 pt-4 border-top">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-orange fw-medium text-decoration-none">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
