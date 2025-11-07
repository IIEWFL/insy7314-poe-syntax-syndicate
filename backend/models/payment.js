const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  paymentType: { type: String, enum: ['internal', 'international'], required: true },

  // For internal transfers
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // For international payments
  beneficiary: { type: String },
  beneficiaryBank: { type: String },
  beneficiaryAccount: { type: String, required: true },
  swiftCode: { type: String },

  amount: { type: Number, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Payment', paymentSchema);
