/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const moviesRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Movie = require('../models/movie');

moviesRouter.get('/', async (request, response) => {
  const movies = await Movie.find({});
  response.json(movies.map((movie) => movie.toJSON()));
});

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7);
  }
  return null;
};

moviesRouter.post('/', async (request, response) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).send({ error: 'missing or invalid token' });
  }
  const movie = new Movie(request.body);
  const addedMovie = await movie.save();
  response.status(201).json(addedMovie);
});

moviesRouter.put('/:id', async (request, response) => {
  const token = getTokenFrom(request);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return response.status(401).send({ error: 'missing or invalid token' });
  }
  const newMovie = request.body;
  const movieToUpdate = await Movie.findByIdAndUpdate(request.params.id, newMovie, { new: true });
  response.json(movieToUpdate);
});

moviesRouter.get('/deleteAll', async (request, response) => {
  await Movie.deleteMany({});
  response.send(200).json({ status: 'deleted' });
});

module.exports = moviesRouter;
