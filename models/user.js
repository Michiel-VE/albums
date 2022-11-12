const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const { APIError } = require('../customErrors/custom');
const roles = ['admin', 'user'];

const validEmailCheck = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'Email is required'],
    validate: [validEmailCheck, new APIError('This is not valid email address', StatusCodes.BAD_REQUEST)],
  },
  role: {
    type: String,
    required: [true, 'User role must be provided'],
    enum: roles,
    default: 'user',
  },

  passwordHash: String,
});

module.exports = mongoose.model('User', userSchema, 'users');
