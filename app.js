/* eslint-disable max-len */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const passport = require('passport');
const config = require('./config/config');
const authentication = require('./middleware/authentication');
const moviesRouter = require('./controllers/movies');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

const app = express();

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('connected to mongodb'))
  .catch((error) => console.error('cannot connect to mongodb: ', error.message));

app.use(cors());
app.use(express.json());
 
// I STILL NEED TO START USING AUTHENTICATION

app.use('/api/movies', moviesRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

module.exports = app;
