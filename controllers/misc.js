const miscRouter = require('express').Router();
const Movie = require('../models/movie');
const Cinema = require('../models/cinema');

miscRouter.get('/random/movie', async (request, response) => {
  Movie.findOneRandom((err, result) => {
    if (!err) {
      response.status(200).json(result.toJSON()); // 1 element
    }
  });
});

miscRouter.get('/seats/:id', async (request, response) => {
  const cinema = await Cinema.findById(request.params.id);
  const allSeats = cinema.seats;
  response.json(allSeats);
});

module.exports = miscRouter;
