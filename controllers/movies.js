/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable eqeqeq */
/* eslint-disable function-paren-newline */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const moviesRouter = require('express').Router();
const imdb = require('imdb-api');
const multer = require('multer');
const cloudinary = require('cloudinary');
const Movie = require('../models/movie');
const Reservation = require('../models/reservation');
const authMiddleware = require('../middleware/authentication');

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

moviesRouter.get('/moviesRated', authMiddleware, async (request, response) => {
  const movies = await Movie.find({}); // Pronadji sve filmove i spremi ih u poseban array gdje za svaki film spremamo skupnu ocjenu
  let moviesWithRating = [];
  movies.forEach((movie) => {
    const movieConRating = {
      movie,
      sumRating: 0,
    };
    moviesWithRating.push(movieConRating);
  });
  const reservations = await Reservation.find({}).populate('screeningTime_id', { movie_id: 1 });
  // Idi po svim rezervacijama
  reservations.forEach((reservation) => {
    // Identificiraj filma u rezervaciji
    const movieInReservation = movies.find((movie) => {
      if (String(movie._id) == String(reservation.screeningTime_id.movie_id)) return true;
    });
    // Ako si ga pronasao
    if (movieInReservation) {
      // U našem kreiranom arrayu najdi film koji se odnosi na trenutnu rezervaciju
      const movieToRate = moviesWithRating.find((movie) => {
        if (movie.movie._id == movieInReservation._id) return true;
      });
      // Ako si pronašel taj film i on je ocijenjen, onda pribroji ocjenu skupnuj ocjeni i spremi promjene u tom arrayu
      if (reservation.ownRating && movieToRate) {
        movieToRate.sumRating += reservation.ownRating;
        moviesWithRating = moviesWithRating.map((movie) => (movie.movie._id == movieToRate.movie._id ? movieToRate : movie));
      }
    }
  });
  response.json(moviesWithRating.map((movie) => ({
    title: movie.movie.title,
    'Summed rating': movie.sumRating,
  })));
});

// All movies
moviesRouter.get('/', async (request, response) => {
  const movies = await Movie.find({}).populate('cinemas', { name: 1 });
  response.json(movies.map((movie) => movie.toJSON()));
});

moviesRouter.get('/:id', async (request, response) => {
  console.log(request.params.id);
  const foundMovie = await Movie.findById(request.params.id).populate('cinemas', { name: 1 }).populate('screeningTimes', { cinema_id: 1, datetime_start: 1, datetime_end: 1 });
  console.log(foundMovie);
  response.status(200).json(foundMovie);
});

cloudinary.config({
  cloud_name: 'cinemaapp',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

moviesRouter.post('/', upload.single('moviePoster'), authMiddleware, async (request, response) => {
  console.log(' i received the request');
  let movieData;
  // First, fetch movie data
  try {
    movieData = await imdb.get({ name: `${request.body.movieName}` }, { apiKey: '2af0120f', timeout: 30000 });
    console.log('im trying');
  } catch (exception) {
    console.log('exception caught');
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
    response.json(addedMovie);
  });
});

moviesRouter.delete('/:id', authMiddleware, async (request, response) => {
  await Movie.findOneAndDelete({ _id: request.params.id });
  response.status(204).send({ info: 'movie deleted' });
});

module.exports = moviesRouter;
