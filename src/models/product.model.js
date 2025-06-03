const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  photoFilename: {
    type: String,
    trim: true
  },
  photoUrl: {
    type: String,
    trim: true
  },
  isWeightBased: {
    type: Boolean,
    default: false
  },
  metadata: {
    createdAt: {
      type: Date,
      default: Date.now
    },
    platform: {
      type: String,
      enum: ['ios', 'android', 'web'],
      default: 'web'
    },
    hasLocalPhoto: {
      type: Boolean,
      default: false
    },
    hasCloudinaryUrl: {
      type: Boolean,
      default: false
    },
    isWeightBased: {
      type: Boolean,
      default: false
    }
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema); 