/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const random = require('mongoose-simple-random');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  director: {
    type: String,
    required: true,
  },
  coverArt: {
    type: String,
    required: true,
  },
  backdropImage: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  actors: { // to bi moglo biti i array al bumo vidli
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
});

movieSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

movieSchema.plugin(uniqueValidator);
movieSchema.plugin(random);

module.exports = mongoose.model('Movie', movieSchema);
