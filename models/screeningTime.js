const mongoose = require('mongoose');

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

module.exports = mongoose.Model('ScreeningTime', screeningTimeSchema);
