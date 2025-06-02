const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const posSchema = new mongoose.Schema({
  saleNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [saleItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cash', 'credit_card', 'debit_card', 'transfer']
  },
  status: {
    type: String,
    required: true,
    enum: ['completed', 'cancelled', 'refunded'],
    default: 'completed'
  },
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Calculate totals before saving
posSchema.pre('save', function(next) {
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.tax = this.subtotal * 0.16; // 16% tax rate
  this.total = this.subtotal + this.tax;
  next();
});

module.exports = mongoose.model('POS', posSchema); 