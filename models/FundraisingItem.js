const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  targetAmountKobo: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['draft', 'active', 'funded', 'purchased', 'archived'], default: 'draft' },
  imageUrl: { type: String, trim: true, maxlength: 500, default: '' },
  imagePublicId: { type: String, trim: true, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('FundraisingItem', itemSchema);
