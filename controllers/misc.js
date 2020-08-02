/* eslint-disable eqeqeq */
const miscRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Cinema = require('../models/cinema');
const ScreeningTime = require('../models/screeningTime');
const User = require('../models/user');

miscRouter.get('/seats/:id', async (request, response) => {
  const screeningTime = await ScreeningTime.findById(request.params.id);
  const allSeats = screeningTime.seats;
  response.json(allSeats);
});

miscRouter.get('/ticketPrice/:id', async (request, response) => {
  const cinema = await Cinema.findById(request.params.id);
  const { ticketPrice } = cinema; // object destructuring to get ticketPrice
  response.json({ ticketPrice });
});

// verify token
miscRouter.get('/verifyToken', async (request, response) => {
  try {
    const token = request.header('Authorization').replace('Bearer ', ''); // remove bearer from authorization header to get only the token
    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log(decodedToken);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
    const user = await User.findById(decodedToken.id);
    if (user) {
      response.send({ authenticated: true });
    }
  } catch (error) {
    if (error.name == 'JsonWebTokenError') {
      response.send({ authenticated: false });
    }
  }
});

miscRouter.get('/verifyTokenAdmin', async (request, response) => {
  try {
    const token = request.header('Authorization').replace('Bearer ', ''); // remove bearer from authorization header to get only the token
    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log(decodedToken);
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' });
    }
    const user = await User.findById(decodedToken.id);
    if (user.user_type == 'administrator') {
      response.send({ authenticated: true });
    } else {
      response.send({ authenticated: false });
    }
  } catch (error) {
    if (error.name == 'JsonWebTokenError') {
      response.send({ authenticated: false });
    }
  }
});

module.exports = miscRouter;
