/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { body } = request;
  const user = await User.findOne({ email: body.email });
  const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash);
  if (!(user && passwordCorrect)) {
    return response.status(401).json({ error: 'invalid name or password' });
  }
  const userForToken = {
    username: user.username,
    id: user._id,
  };
  // generate token
  const token = jwt.sign(userForToken, process.env.SECRET);
  response.status(200).send({ token, user });
  // response.status(200).send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
