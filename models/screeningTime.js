/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const screeningTimeSchema = new mongoose.Schema({
  movie_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'Movie',
  },
  cinema_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'Cinema',
  },
  datetime_start: {
    type: Date,
    required: true,
  },
  datetime_end: {
    type: Date,
    required: true,
  },
});

screeningTimeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

screeningTimeSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ScreeningTime', screeningTimeSchema);
