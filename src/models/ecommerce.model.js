const mongoose = require('mongoose');

const ecommerceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storeName: {
    type: String,
    required: true,
    trim: true
  },
  storeDescription: {
    type: String,
    trim: true
  },
  contactInfo: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    }
  },
  socialMedia: {
    website: String,
    facebook: String,
    instagram: String,
    twitter: String
  },
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  paymentMethods: [{
    type: String,
    enum: ['cash', 'credit_card', 'debit_card', 'paypal', 'bank_transfer']
  }],
  shippingOptions: [{
    name: String,
    price: Number,
    estimatedDays: Number
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Ecommerce', ecommerceSchema); 