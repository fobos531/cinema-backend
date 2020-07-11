/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_type: {
    type: String,
    required: true,
    enum: ['administrator', 'registeredUser', 'guestUser'],
  },
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password; // hide password
  // eslint-disable-next-line comma-dangle
  }
});

module.exports = mongoose.model('User', userSchema);
