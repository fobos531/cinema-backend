const mongoose = require('mongoose');

// TO DO - expand schema

const reservationSchema = new mongoose.Schema({
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
  screeningTime_id: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: 'ScreeningTime',
  },
});

module.exports = mongoose.model('Reservation', reservationSchema);
