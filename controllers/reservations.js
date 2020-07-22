const reservationsRouter = require('express').Router();
//const Movie = require('../models/movie');
const Cinema = require('../models/cinema');


reservationsRouter.patch('/cinema/:id', async (request, response) => {
  const cinema = await Cinema.findById(request.params.id);
  cinema.seats = request.body; // seats array je direktno u request.body

  await cinema.save();
  response.json(cinema.seats);
});

module.exports = reservationsRouter;
