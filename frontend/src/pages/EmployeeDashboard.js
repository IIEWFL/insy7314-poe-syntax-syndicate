import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected
  const [processingId, setProcessingId] = useState(null);

  const fetchPayments = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const endpoint = filter === 'pending' ? '/api/payment/pending' : '/api/payment/all';

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let filteredPayments = response.data;
      if (filter !== 'all' && filter !== 'pending') {
        filteredPayments = response.data.filter(p => p.status === filter);
      }

      setPayments(filteredPayments);
      setError('');
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleVerifyPayment = async (paymentId, status) => {
    if (!window.confirm(`Are you sure you want to ${status.toLowerCase()} this payment?`)) {
      return;
    }

    try {
      setProcessingId(paymentId);
      const token = localStorage.getItem('token');
      
      await axios.post(
        `/api/payment/verify/${paymentId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh payments list
      fetchPayments();
      alert(`Payment ${status.toLowerCase()} successfully!`);
    } catch (err) {
      console.error('Error verifying payment:', err);
      alert(err.response?.data?.error || 'Failed to verify payment');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (status) => {
    const badges = {
      Pending: 'badge-warning',
      Approved: 'badge-success',
      Rejected: 'badge-danger'
    };
    return badges[status] || 'badge-secondary';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="employee-dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>🏢 Employee Portal</h1>
          <div className="user-info">
            <span className="welcome-text">Welcome, {user?.username}</span>
            <span className="role-badge">Employee</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="filter-section">
          <h3>Filter Payments</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Payments
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending
            </button>
            <button 
              className={`filter-btn ${filter === 'Approved' ? 'active' : ''}`}
              onClick={() => setFilter('Approved')}
            >
              Approved
            </button>
            <button 
              className={`filter-btn ${filter === 'Rejected' ? 'active' : ''}`}
              onClick={() => setFilter('Rejected')}
            >
              Rejected
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="loading">Loading payments...</div>
        ) : payments.length === 0 ? (
          <div className="no-payments">
            <p>No payments found for the selected filter.</p>
          </div>
        ) : (
          <div className="payments-table-container">
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Customer</th>
                  <th>Account</th>
                  <th>Recipient</th>
                  <th>Recipient Acc</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td>{formatDate(payment.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${payment.paymentType === 'internal' ? 'status-info' : 'status-secondary'}`}>
                        {payment.paymentType === 'internal' ? 'Internal' : 'International'}
                      </span>
                    </td>
                    <td>{payment.userId?.name || 'N/A'}</td>
                    <td>{payment.userId?.accountNumber || 'N/A'}</td>
                    <td>{payment.beneficiary || 'N/A'}</td>
                    <td>{payment.beneficiaryAccount}</td>
                    <td className="amount">{formatCurrency(payment.amount)}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      {payment.status === 'Pending' ? (
                        <div className="action-buttons">
                          <button
                            className="btn-approve"
                            onClick={() => handleVerifyPayment(payment._id, 'Approved')}
                            disabled={processingId === payment._id}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleVerifyPayment(payment._id, 'Rejected')}
                            disabled={processingId === payment._id}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      ) : (
                        <span className="processed-text">
                          {payment.verifiedBy?.name || 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;

