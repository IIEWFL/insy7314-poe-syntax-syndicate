import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Table, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import {
  FaWallet,
  FaPaperPlane,
  FaChartLine,
  FaGlobe,
  FaShieldAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPlus,
  FaDownload,
  FaEye
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Dummy data for demonstration
  const balance = 10000.00;
  const accountNumber = user?.accountNumber || 'Loading...';
  
  const recentTransactions = [
    {
      id: 'TXN001',
      type: 'Incoming',
      amount: 2500.00,
      currency: 'ZAR',
      from: 'John Smith (UK)',
      date: '2024-10-09',
      status: 'Completed'
    },
    {
      id: 'TXN002',
      type: 'Outgoing',
      amount: 1200.00,
      currency: 'ZAR',
      to: 'Sarah Johnson (USA)',
      date: '2024-10-08',
      status: 'Pending'
    },
    {
      id: 'TXN003',
      type: 'Incoming',
      amount: 800.00,
      currency: 'ZAR',
      from: 'Michael Brown (Germany)',
      date: '2024-10-07',
      status: 'Completed'
    }
  ];

  const quickStats = [
    { label: 'Total Sent', value: 'R 15,200', icon: FaPaperPlane, color: 'primary' },
    { label: 'Total Received', value: 'R 8,750', icon: FaWallet, color: 'success' },
    { label: 'Pending', value: '2', icon: FaClock, color: 'warning' },
    { label: 'Countries', value: '12', icon: FaGlobe, color: 'info' }
  ];

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge bg="success"><FaCheckCircle className="me-1" />Completed</Badge>;
      case 'pending':
        return <Badge bg="warning"><FaClock className="me-1" />Pending</Badge>;
      case 'failed':
        return <Badge bg="danger"><FaExclamationTriangle className="me-1" />Failed</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="dashboard-page" style={{ paddingTop: '100px', minHeight: '100vh' }}>
      <Container fluid>
        {/* Welcome Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h1 className="display-6 fw-bold text-primary-orange mb-2">
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className="text-muted mb-0">
                  Account: {accountNumber} | Last login: {currentTime.toLocaleString()}
                </p>
              </div>
              <div className="text-end">
                <Badge bg="success" className="fs-6 px-3 py-2">
                  <FaShieldAlt className="me-2" />
                  Secure Session
                </Badge>
              </div>
            </div>
          </Col>
        </Row>

        {/* Task 3 Notice */}
        <Row className="mb-4">
          <Col>
            <Alert variant="info" className="border-0 shadow-sm">
              <div className="d-flex align-items-center">
                <FaExclamationTriangle className="text-info me-3" style={{ fontSize: '1.5rem' }} />
                <div>
                  <h5 className="alert-heading mb-1">Coming Soon - Task 3!</h5>
                  <p className="mb-0">
                    Full transaction functionality will be available in Task 3. 
                    Currently showing demo data for testing purposes.
                  </p>
                </div>
              </div>
            </Alert>
          </Col>
        </Row>

        {/* Balance Card */}
        <Row className="mb-4">
          <Col lg={8}>
            <Card className="card-custom gradient-bg text-white h-100">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={8}>
                    <div className="d-flex align-items-center mb-3">
                      <FaWallet className="me-3" style={{ fontSize: '2.5rem' }} />
                      <div>
                        <h6 className="mb-1 opacity-75">Available Balance</h6>
                        <h2 className="display-4 fw-bold mb-0">
                          R {balance.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                        </h2>
                      </div>
                    </div>
                    <p className="mb-0 opacity-75">
                      Your account is ready for international transactions
                    </p>
                  </Col>
                  <Col md={4} className="text-center">
                    <div className="mb-3">
                      <Button 
                        variant="outline-light" 
                        size="lg" 
                        className="mb-2 w-100"
                        disabled
                      >
                        <FaPaperPlane className="me-2" />
                        Send Money
                      </Button>
                      <small className="d-block text-white-50">Coming in Task 3</small>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="card-custom h-100">
              <Card.Body className="p-4 text-center">
                <FaChartLine className="text-primary-orange mb-3" style={{ fontSize: '3rem' }} />
                <h5 className="fw-bold mb-2">Account Performance</h5>
                <p className="text-muted mb-3">Track your transaction history</p>
                <Button variant="outline-primary" disabled>
                  <FaEye className="me-2" />
                  View Analytics
                </Button>
                <small className="d-block text-muted mt-2">Coming in Task 3</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Stats */}
        <Row className="mb-4">
          {quickStats.map((stat, index) => (
            <Col lg={3} md={6} key={index} className="mb-3">
              <Card className="card-custom h-100">
                <Card.Body className="p-4 text-center">
                  <stat.icon 
                    className={`text-${stat.color} mb-3`} 
                    style={{ fontSize: '2.5rem' }} 
                  />
                  <h4 className="fw-bold mb-1">{stat.value}</h4>
                  <p className="text-muted mb-0">{stat.label}</p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Recent Transactions */}
        <Row>
          <Col>
            <Card className="card-custom">
              <Card.Header className="bg-white border-0 p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="fw-bold mb-1">Recent Transactions</h5>
                    <p className="text-muted mb-0">Your latest payment activity</p>
                  </div>
                  <div>
                    <Button variant="outline-primary" size="sm" className="me-2" disabled>
                      <FaDownload className="me-1" />
                      Export
                    </Button>
                    <Button variant="primary" size="sm" className="btn-primary-orange" disabled>
                      <FaPlus className="me-1" />
                      New Transaction
                    </Button>
                  </div>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0 px-4 py-3">Transaction ID</th>
                      <th className="border-0 py-3">Type</th>
                      <th className="border-0 py-3">Amount</th>
                      <th className="border-0 py-3">Counterparty</th>
                      <th className="border-0 py-3">Date</th>
                      <th className="border-0 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-4 py-3">
                          <code className="text-primary-orange">{transaction.id}</code>
                        </td>
                        <td className="py-3">
                          <Badge 
                            bg={transaction.type === 'Incoming' ? 'success' : 'primary'} 
                            className="px-2 py-1"
                          >
                            {transaction.type}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <span className="fw-medium">
                            R {transaction.amount.toLocaleString('en-ZA', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                        <td className="py-3">
                          {transaction.from || transaction.to}
                        </td>
                        <td className="py-3 text-muted">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3">
                          {getStatusBadge(transaction.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                
                {/* Coming Soon Footer */}
                <div className="p-4 bg-light text-center border-top">
                  <p className="text-muted mb-2">
                    <FaClock className="me-2" />
                    Full transaction management coming in Task 3
                  </p>
                  <small className="text-muted">
                    This is demo data for testing the user interface and authentication system.
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
