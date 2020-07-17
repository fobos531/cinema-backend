const screeningTimesRouter = require('express').Router();
const ScreeningTime = require('../models/screeningTime')


screeningTimesRouter.post('/', async (request, response) => {
  console.log(request.body);
  const newScreeningTime = new ScreeningTime({
    movie_id: request.body.movie,
    cinema_id: request.body.cinema,
    datetime_start: request.body.datetime_start,
    datetime_end: request.body.datetime_end,
  });
  const savedScreeningTime = await newScreeningTime.save();
  response.json(savedScreeningTime);
});

module.exports = screeningTimesRouter;
