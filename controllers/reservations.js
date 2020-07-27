const reservationsRouter = require('express').Router();
const ScreeningTime = require('../models/screeningTime');
const Cinema = require('../models/cinema');
const Reservation = require('../models/reservation');
const authMiddleware = require('../middleware/authentication');

reservationsRouter.patch('/cinema/:id', authMiddleware, async (request, response) => {
  const cinema = await Cinema.findById(request.params.id);
  cinema.seats = request.body; // seats array je direktno u request.body

  await cinema.save();
  response.json(cinema.seats);
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

reservationsRouter.get('/', authMiddleware, async (request, response) => {
  const allReservations = await Reservation.find({}).populate('user_id', { username: 1, name: 1 });
  response.status(200).json(allReservations);
});

module.exports = reservationsRouter;
