const mongoose = require('mongoose');
const crypto = require('crypto');

const contributionSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'FundraisingItem', required: true, index: true },
  donorName: { type: String, trim: true, maxlength: 100, default: 'Anonymous supporter' },
  donorEmail: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
  amountKobo: { type: Number, required: true, min: 100 },
  paymentCode: { type: String, required: true, unique: true, index: true },
  transferReference: { type: String, trim: true, maxlength: 120, default: '' },
  status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending', index: true },
  verifiedAt: { type: Date, default: null },
  adminNote: { type: String, trim: true, maxlength: 500, default: '' }
}, { timestamps: true });

contributionSchema.statics.createPaymentCode = function () {
  return `LUXE-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
};

module.exports = mongoose.model('Contribution', contributionSchema);
