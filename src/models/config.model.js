const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  googleDrive: {
    clientId: {
      type: String,
      trim: true
    },
    clientSecret: {
      type: String,
      trim: true
    },
    refreshToken: {
      type: String,
      trim: true
    },
    folderId: {
      type: String,
      trim: true
    },
    isConfigured: {
      type: Boolean,
      default: false
    }
  },
  email: {
    service: {
      type: String,
      enum: ['gmail', 'outlook', 'smtp'],
      default: 'gmail'
    },
    host: {
      type: String,
      trim: true
    },
    port: {
      type: Number
    },
    secure: {
      type: Boolean,
      default: true
    },
    auth: {
      user: {
        type: String,
        trim: true
      },
      pass: {
        type: String,
        trim: true
      }
    },
    from: {
      type: String,
      trim: true
    },
    isConfigured: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Config', configSchema); 