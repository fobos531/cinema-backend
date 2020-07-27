/* eslint-disable function-paren-newline */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const moviesRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const imdb = require('imdb-api');
const multer = require('multer');
const cloudinary = require('cloudinary');
const Movie = require('../models/movie');

const storage = multer.diskStorage({
  filename(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
const imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};
const upload = multer({ storage, fileFilter: imageFilter });

// All movies
moviesRouter.get('/', async (request, response) => {
  const movies = await Movie.find({}).populate('cinemas', { name: 1 });
  response.json(movies.map((movie) => movie.toJSON()));
});

moviesRouter.get('/:id', async (request, response) => {
  console.log(request.params.id);
  const foundMovie = await Movie.findById(request.params.id).populate('cinemas', { name: 1 }).populate('screeningTimes', { datetime_start: 1, datetime_end: 1 });
  console.log(foundMovie);
  response.status(200).json(foundMovie);
});

cloudinary.config({
  cloud_name: 'cinemaapp',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

moviesRouter.post('/', upload.single('moviePoster'), async (request, response) => {
  let movieData;
  // First, fetch movie data
  try {
    movieData = await imdb.get({ name: `${request.body.movieName}` }, { apiKey: '2af0120f', timeout: 30000 });
  } catch (exception) {
    return response.status(400).json(exception);
  }
  let addedMovie;
  // Then, if successful, upload the movie poster to cloudinary and save the movie
  console.log(movieData);
  cloudinary.uploader.upload(request.file.path, async (result) => {
    const movie = new Movie({
      title: movieData.title,
      director: movieData.director,
      coverArt: movieData.poster,
      backdropImage: result.url,
      genre: movieData.genres,
      actors: movieData.actors,
      summary: movieData.plot,
      releaseDate: movieData.released,
      rating: movieData.rating,
    });
    addedMovie = await movie.save();
  });
  response.json(addedMovie);
});

moviesRouter.delete('/:id', async (request, response) => {
  await Movie.findOneAndDelete({ _id: request.params.id });
  response.status(204).send({ info: 'movie deleted' });
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
