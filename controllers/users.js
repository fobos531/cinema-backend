const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Add user
usersRouter.post('/', async (req, res) => {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 salt rounds is default
  const newUser = new User({
    userData,
    hashedPassword,
    user_type: 'registeredUser',
  });
  const addedUser = await newUser.save();
  res.send(200).json(addedUser);
});
