/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// TO DO - expand schema

const reservationSchema = new mongoose.Schema({
  screeningTime_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'ScreeningTime',
  },
  user_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'User',
  },
  seats: [
    {
      type: mongoose.SchemaTypes.Mixed,
      required: true,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
});

reservationSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

reservationSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Reservation', reservationSchema);
