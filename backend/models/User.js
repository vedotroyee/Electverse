const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
  },
  systemsViewed: {
    type: [String],
    default: [],
  },
  quizResult: {
    type: String,
    default: null,
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
