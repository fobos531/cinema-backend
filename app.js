/* eslint-disable max-len */
/* eslint-disable no-console */
const mongoose = require('mongoose');
// const cors = require('cors');
const express = require('express');
const config = require('./utils/config');

const app = express();

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log('connected to mongodb'))
  .catch((error) => console.error('cannot connect to mongodb: ', error.message));

// app.use(cors());
app.use(express.json());
module.exports = app;
