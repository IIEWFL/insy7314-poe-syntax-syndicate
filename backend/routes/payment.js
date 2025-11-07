const express = require('express');
const router = express.Router();
const Payment = require('../models/payment');

// Make Payment Route
router.post('/make-payment', async (req, res) => {
  const { userId, beneficiary, amount, description } = req.body;

  if (!userId || !beneficiary || !amount || !description) {
    return res.status(400).json({ error: 'All payment fields are required' });
  }

  try {
    const newPayment = new Payment({
      userId,
      beneficiary,
      amount,
      description,
      status: 'Pending' // Payment is marked as pending for admin approval
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment logged for approval' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to log payment. Please try again.' });
  }
});

module.exports = router;
