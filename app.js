/* eslint-disable max-len */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/config');
const moviesRouter = require('./controllers/movies');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const cinemasRouter = require('./controllers/cinemas');
const screeningTimesRouter = require('./controllers/screeningTimes');
const miscRouter = require('./controllers/misc');
const reservationsRouter = require('./controllers/reservations');
const authMiddleware = require('./middleware/authentication');

const app = express();

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('connected to mongodb'))
  .catch((error) => console.error('cannot connect to mongodb: ', error.message));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/movies', moviesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/cinemas', cinemasRouter);
app.use('/api/screeningtimes', authMiddleware, screeningTimesRouter);
app.use('/api/misc', miscRouter);
app.use('/api/reservations', reservationsRouter);

module.exports = app;
