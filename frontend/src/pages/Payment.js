import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card, Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaPaperPlane, FaArrowLeft, FaCheckCircle, FaClock, FaTimesCircle, FaExchangeAlt, FaGlobe } from 'react-icons/fa';
import './Payment.css';

const Payment = () => {
  const navigate = useNavigate();
  const [paymentType, setPaymentType] = useState('internal');

  const [formData, setFormData] = useState({
    beneficiary: '',
    beneficiaryBank: '',
    beneficiaryAccount: '',
    amount: '',
    swiftCode: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);

  useEffect(() => {
    fetchMyPayments();
  }, []);

  const fetchMyPayments = async () => {
    try {
      setLoadingPayments(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/payment/my-payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (err) {
      console.error('Error fetching payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const patterns = {
      beneficiary: /^[A-Za-z -]{2,60}$/,
      beneficiaryBank: /^[A-Za-z -]{2,100}$/,
      beneficiaryAccount: /^[0-9]{8,20}$/,
      amount: /^[0-9]+(\.[0-9]{1,2})?$/,
      swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
      description: /^[A-Za-z0-9 .,-]{2,200}$/
    };

    // Common validations
    if (!formData.beneficiaryAccount || !patterns.beneficiaryAccount.test(formData.beneficiaryAccount)) {
      newErrors.beneficiaryAccount = 'Account number must be 8-20 digits';
    }
    if (!formData.amount || !patterns.amount.test(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be a positive number with up to 2 decimal places';
    }
    if (!formData.description || !patterns.description.test(formData.description)) {
      newErrors.description = 'Description must be 2-200 characters (letters, numbers, spaces, hyphens, periods, commas only)';
    }

    // International payment specific validations
    if (paymentType === 'international') {
      if (!formData.beneficiary || !patterns.beneficiary.test(formData.beneficiary)) {
        newErrors.beneficiary = 'Beneficiary name must be 2-60 characters (letters, spaces, hyphens only)';
      }
      if (!formData.beneficiaryBank || !patterns.beneficiaryBank.test(formData.beneficiaryBank)) {
        newErrors.beneficiaryBank = 'Bank name must be 2-100 characters (letters, spaces, hyphens only)';
      }
      if (!formData.swiftCode || !patterns.swiftCode.test(formData.swiftCode.toUpperCase())) {
        newErrors.swiftCode = 'SWIFT code must be 8 or 11 characters (e.g., ABCDEF2A or ABCDEF2AXXX)';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'danger', text: 'Please fix the errors in the form' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const token = localStorage.getItem('token');
      const payload = {
        paymentType,
        beneficiaryAccount: formData.beneficiaryAccount,
        amount: formData.amount,
        description: formData.description
      };

      // Add international payment fields if needed
      if (paymentType === 'international') {
        payload.beneficiary = formData.beneficiary;
        payload.beneficiaryBank = formData.beneficiaryBank;
        payload.swiftCode = formData.swiftCode;
      }

      const response = await axios.post('/api/payment/create', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ type: 'success', text: response.data.message });
      setFormData({
        beneficiary: '',
        beneficiaryBank: '',
        beneficiaryAccount: '',
        amount: '',
        swiftCode: '',
        description: ''
      });

      // Refresh payments list
      fetchMyPayments();
    } catch (err) {
      setMessage({
        type: 'danger',
        text: err.response?.data?.error || 'Failed to submit payment request'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: <Badge bg="warning" text="dark"><FaClock className="me-1" /> Pending</Badge>,
      Approved: <Badge bg="success"><FaCheckCircle className="me-1" /> Approved</Badge>,
      Rejected: <Badge bg="danger"><FaTimesCircle className="me-1" /> Rejected</Badge>
    };
    return badges[status] || <Badge bg="secondary">{status}</Badge>;
  };

  const formatCurrency = (amount) => {
    return `R ${parseFloat(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="payment-page" style={{ paddingTop: '100px', minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <Button variant="outline-light" onClick={() => navigate('/dashboard')}>
              <FaArrowLeft className="me-2" /> Back to Dashboard
            </Button>
          </Col>
        </Row>

        <Row>
          <Col lg={6} className="mb-4">
            <Card className="shadow-lg border-0">
              <Card.Body className="p-4">
                <h3 className="fw-bold mb-4 text-center" style={{ color: '#667eea' }}>
                  <FaPaperPlane className="me-2" />
                  Send Payment
                </h3>

                {message.text && (
                  <Alert variant={message.type} onClose={() => setMessage({ type: '', text: '' })} dismissible>
                    {message.text}
                  </Alert>
                )}

                {/* Payment Type Selector */}
                <div className="mb-4">
                  <div className="btn-group w-100" role="group">
                    <button
                      type="button"
                      className={`btn ${paymentType === 'internal' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setPaymentType('internal')}
                      style={{ borderRadius: '10px 0 0 10px' }}
                    >
                      <FaExchangeAlt className="me-2" />
                      Internal Transfer
                    </button>
                    <button
                      type="button"
                      className={`btn ${paymentType === 'international' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setPaymentType('international')}
                      style={{ borderRadius: '0 10px 10px 0' }}
                    >
                      <FaGlobe className="me-2" />
                      International
                    </button>
                  </div>
                </div>

                <Form onSubmit={handleSubmit}>
                  {/* International Payment Fields */}
                  {paymentType === 'international' && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Beneficiary Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="beneficiary"
                          value={formData.beneficiary}
                          onChange={handleChange}
                          isInvalid={!!errors.beneficiary}
                          placeholder="John Doe"
                        />
                        <Form.Control.Feedback type="invalid">{errors.beneficiary}</Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Beneficiary Bank</Form.Label>
                        <Form.Control
                          type="text"
                          name="beneficiaryBank"
                          value={formData.beneficiaryBank}
                          onChange={handleChange}
                          isInvalid={!!errors.beneficiaryBank}
                          placeholder="Standard Bank"
                        />
                        <Form.Control.Feedback type="invalid">{errors.beneficiaryBank}</Form.Control.Feedback>
                      </Form.Group>
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>
                      {paymentType === 'internal' ? 'Recipient Account Number' : 'Beneficiary Account Number'}
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="beneficiaryAccount"
                      value={formData.beneficiaryAccount}
                      onChange={handleChange}
                      isInvalid={!!errors.beneficiaryAccount}
                      placeholder={paymentType === 'internal' ? '6200000002' : '1234567890'}
                    />
                    <Form.Control.Feedback type="invalid">{errors.beneficiaryAccount}</Form.Control.Feedback>
                    {paymentType === 'internal' && (
                      <Form.Text className="text-muted">
                        Enter the account number of another user in our system
                      </Form.Text>
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Amount (ZAR)</Form.Label>
                    <Form.Control
                      type="text"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      isInvalid={!!errors.amount}
                      placeholder="1000.00"
                    />
                    <Form.Control.Feedback type="invalid">{errors.amount}</Form.Control.Feedback>
                  </Form.Group>

                  {paymentType === 'international' && (
                    <Form.Group className="mb-3">
                      <Form.Label>SWIFT Code</Form.Label>
                      <Form.Control
                        type="text"
                        name="swiftCode"
                        value={formData.swiftCode}
                        onChange={handleChange}
                        isInvalid={!!errors.swiftCode}
                        placeholder="SBZAZAJJ"
                        style={{ textTransform: 'uppercase' }}
                      />
                      <Form.Control.Feedback type="invalid">{errors.swiftCode}</Form.Control.Feedback>
                      <Form.Text className="text-muted">8 or 11 characters (e.g., SBZAZAJJ or SBZAZAJJXXX)</Form.Text>
                    </Form.Group>
                  )}

                  <Form.Group className="mb-4">
                    <Form.Label>Payment Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      isInvalid={!!errors.description}
                      placeholder="Invoice payment for services rendered"
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg" 
                    className="w-100"
                    disabled={loading}
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                  >
                    {loading ? 'Submitting...' : 'Submit Payment Request'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-4">
                <h3 className="fw-bold mb-4 text-center" style={{ color: '#667eea' }}>
                  My Payment Requests
                </h3>

                {loadingPayments ? (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : payments.length === 0 ? (
                  <div className="text-center py-5 text-muted">
                    <p>No payment requests yet</p>
                  </div>
                ) : (
                  <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <Table hover responsive>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Type</th>
                          <th>Recipient</th>
                          <th>Account</th>
                          <th>Amount</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment._id}>
                            <td style={{ fontSize: '0.85rem' }}>{formatDate(payment.createdAt)}</td>
                            <td>
                              <Badge bg={payment.paymentType === 'internal' ? 'info' : 'secondary'}>
                                {payment.paymentType === 'internal' ? 'Internal' : 'International'}
                              </Badge>
                            </td>
                            <td>{payment.beneficiary || 'N/A'}</td>
                            <td style={{ fontSize: '0.85rem' }}>{payment.beneficiaryAccount}</td>
                            <td className="fw-bold">{formatCurrency(payment.amount)}</td>
                            <td>{getStatusBadge(payment.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Payment;

