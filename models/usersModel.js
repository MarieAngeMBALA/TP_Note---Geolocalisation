const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedSearches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'mam_searches',
  }],
});

const User = mongoose.model('MAM_users', userSchema);

module.exports = User;
