const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');
const authenticateToken = require('../middleware/authenticateToken');

// Validation patterns for payment fields
const patterns = {
  beneficiary: /^[A-Za-z \-]{2,60}$/,
  beneficiaryBank: /^[A-Za-z \-]{2,100}$/,
  beneficiaryAccount: /^[0-9]{8,20}$/,
  amount: /^[0-9]+(\.[0-9]{1,2})?$/,
  swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  description: /^[A-Za-z0-9 \-.,]{2,200}$/
};

// Middleware to check if user is employee
const isEmployee = (req, res, next) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ error: 'Access denied. Employee access required.' });
  }
  next();
};

// Create new payment (Customer only)
router.post('/create', authenticateToken, async (req, res) => {
  const { beneficiary, beneficiaryBank, beneficiaryAccount, amount, swiftCode, description } = req.body;

  // Validate all required fields
  if (!beneficiary || !beneficiaryBank || !beneficiaryAccount || !amount || !swiftCode || !description) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Whitelist validation
  if (!patterns.beneficiary.test(beneficiary)) {
    return res.status(400).json({ error: 'Invalid beneficiary name format' });
  }
  if (!patterns.beneficiaryBank.test(beneficiaryBank)) {
    return res.status(400).json({ error: 'Invalid bank name format' });
  }
  if (!patterns.beneficiaryAccount.test(beneficiaryAccount)) {
    return res.status(400).json({ error: 'Invalid account number format' });
  }
  if (!patterns.amount.test(amount.toString())) {
    return res.status(400).json({ error: 'Invalid amount format' });
  }
  if (!patterns.swiftCode.test(swiftCode)) {
    return res.status(400).json({ error: 'Invalid SWIFT code format' });
  }
  if (!patterns.description.test(description)) {
    return res.status(400).json({ error: 'Invalid description format' });
  }

  // Validate amount is positive
  if (parseFloat(amount) <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero' });
  }

  try {
    const payment = new Payment({
      userId: req.user.id,
      beneficiary,
      beneficiaryBank,
      beneficiaryAccount,
      amount: parseFloat(amount),
      swiftCode: swiftCode.toUpperCase(),
      description,
      status: 'Pending'
    });

    await payment.save();

    res.status(201).json({
      message: 'Payment request submitted successfully',
      payment: {
        id: payment._id,
        beneficiary: payment.beneficiary,
        amount: payment.amount,
        status: payment.status,
        createdAt: payment.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment request' });
  }
});

// Get user's own payments (Customer)
router.get('/my-payments', authenticateToken, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('userId', 'name username accountNumber')
      .populate('verifiedBy', 'name username');

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get all payments (Employee only)
router.get('/all', authenticateToken, isEmployee, async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'name username accountNumber')
      .populate('verifiedBy', 'name username');

    res.json(payments);
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Get pending payments (Employee only)
router.get('/pending', authenticateToken, isEmployee, async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'Pending' })
      .sort({ createdAt: -1 })
      .populate('userId', 'name username accountNumber');

    res.json(payments);
  } catch (error) {
    console.error('Error fetching pending payments:', error);
    res.status(500).json({ error: 'Failed to fetch pending payments' });
  }
});

// Verify payment (Employee only)
router.post('/verify/:id', authenticateToken, isEmployee, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status. Must be Approved or Rejected' });
  }

  try {
    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'Pending') {
      return res.status(400).json({ error: 'Payment has already been processed' });
    }

    payment.status = status;
    payment.verifiedBy = req.user.id;
    payment.verifiedAt = new Date();

    await payment.save();

    const populatedPayment = await Payment.findById(id)
      .populate('userId', 'name username accountNumber')
      .populate('verifiedBy', 'name username');

    res.json({
      message: `Payment ${status.toLowerCase()} successfully`,
      payment: populatedPayment
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

module.exports = router;
