const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  permissions: [{
    type: String,
    enum: [
      'create:user',
      'read:user',
      'update:user',
      'delete:user',
      'create:product',
      'read:product',
      'update:product',
      'delete:product',
      'create:sale',
      'read:sale',
      'update:sale',
      'delete:sale',
      'manage:roles'
    ]
  }],
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Role', roleSchema); 