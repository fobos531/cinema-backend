const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  coverArt: {
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

module.exports = mongoose.model('Movie', movieSchema);
