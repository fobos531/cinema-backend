const miscRouter = require('express').Router();
const Movie = require('../models/movie');

miscRouter.get('/random/movie', async (request, response) => {
  Movie.findOneRandom((err, result) => {
    if (!err) {
      response.status(200).json(result.toJSON()); // 1 element
    }
  });
});

module.exports = miscRouter;
