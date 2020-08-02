const reservationsRouter = require('express').Router();
const ScreeningTime = require('../models/screeningTime');
const Cinema = require('../models/cinema');
const Reservation = require('../models/reservation');
const authMiddleware = require('../middleware/authentication');

reservationsRouter.patch('/screeningTime/:id', authMiddleware, async (request, response) => {
  const screeningTime = await ScreeningTime.findById(request.params.id);
  screeningTime.seats = request.body; // seats array je direktno u request.body

  await screeningTime.save();
  response.json(screeningTime.seats);
});

reservationsRouter.post('/', authMiddleware, async (request, response) => {
  console.log('request reached', request.body);
  const incomingReservation = request.body;
  const screeningTime = await ScreeningTime.findById(incomingReservation.screeningTime_id);
  const cinema = await Cinema.findById(screeningTime.cinema_id);
  incomingReservation.totalPrice = incomingReservation.pickedSeats.length * cinema.ticketPrice;
  incomingReservation.seats = incomingReservation.pickedSeats;
  delete incomingReservation.pickedSeats;
  const newReservation = new Reservation(incomingReservation);
  await newReservation.save();
  response.status(201).json(newReservation.toJSON());
});

reservationsRouter.get('/:id', authMiddleware, async (request, response) => {
  const allReservations = await Reservation.find({ user_id: request.params.id })
    .populate('user_id', { username: 1, name: 1 })
    .populate({
      path: 'screeningTime_id',
      populate: {
        path: 'cinema_id',
        select: 'name',
      },
    }).populate({
      path: 'screeningTime_id',
      populate: {
        path: 'movie_id',
        select: 'title',
      },
    });
  response.status(200).json(allReservations);
});

reservationsRouter.patch('/rate/:id', async (request, response) => {
  let reservation = await Reservation.findById(request.params.id);
  reservation.ownRating = request.body.rating;
  await reservation.save();
  // find reservation again and populate
  reservation = await Reservation.find({ user_id: request.params.id })
    .populate('user_id', { username: 1, name: 1 })
    .populate({
      path: 'screeningTime_id',
      populate: {
        path: 'cinema_id',
        select: 'name',
      },
    }).populate({
      path: 'screeningTime_id',
      populate: {
        path: 'movie_id',
        select: 'title',
      },
    });
  response.status(200).json(reservation);
});


reservationsRouter.get('/', authMiddleware, async (request, response) => {
  const allReservations = await Reservation.find({}).populate('user_id', { username: 1, name: 1 });
  response.status(200).json(allReservations);
});

module.exports = reservationsRouter;
