/* eslint-disable no-underscore-dangle */
const screeningTimesRouter = require('express').Router();
const ScreeningTime = require('../models/screeningTime');
const Movie = require('../models/movie');
const authMiddleware = require('../middleware/authentication');

screeningTimesRouter.post('/', authMiddleware, async (request, response) => {
  console.log(request.body);
  const newScreeningTime = new ScreeningTime({
    movie_id: request.body.movie,
    cinema_id: request.body.cinema,
    datetime_start: request.body.datetime_start,
    datetime_end: request.body.datetime_end,
  });
  const savedScreeningTime = await newScreeningTime.save();
  // sada deni v movie odgovarajuci cinema
  const movie = await Movie.findById(request.body.movie);
  console.log(movie);
  movie.cinemas = movie.cinemas.concat(request.body.cinema); // request.body.cinema je id
  movie.screeningTimes = movie.screeningTimes.concat(savedScreeningTime._id);
  await movie.save();
  response.json(savedScreeningTime);
});

screeningTimesRouter.get('/', async (request, response) => {
  const screeningTimes = await ScreeningTime.find({}).populate('movie_id', { title: 1 }).populate('cinema_id', { name: 1 }); // we populate with this data to
  // help with rendering screening time table in admin panel
  response.json(screeningTimes.map((screeningTime) => screeningTime.toJSON()));
});

// Delete one
screeningTimesRouter.delete('/:id', authMiddleware, async (request, response) => {
  await ScreeningTime.findOneAndDelete({ _id: request.params.id });
  response.status(204).send({ info: 'screening time deleted' });
});

module.exports = screeningTimesRouter;
