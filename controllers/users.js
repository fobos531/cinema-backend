const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Add user
usersRouter.post('/', async (req, res) => {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 salt rounds is default
  const newUser = new User({
    ...userData,
    passwordHash: hashedPassword,
    user_type: 'registeredUser',
  });
  console.log(newUser);
  const addedUser = await newUser.save();
  res.json(addedUser); // mores i prije dodati 200 OK ak zelis
});

usersRouter.put('/', async (request, response) => {
  const userToUpdate = request.body;
  const idOfUserToUpdate = userToUpdate.id;
  delete userToUpdate.id;
  if (userToUpdate.password) {
    const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
    delete userToUpdate.password;
    userToUpdate.passwordHash = hashedPassword;
  }
  console.log('user to update', userToUpdate);
  const userInDb = await User.findById(idOfUserToUpdate);
  console.log('user in db', userInDb);
  if (userToUpdate.fullName) {
    userInDb.name = userToUpdate.fullName;
  }
  if (userToUpdate.email) {
    userInDb.email = userToUpdate.email;
  }
  if (userToUpdate.passwordHash) {
    userInDb.passwordHash = userToUpdate.passwordHash;
  }
  await userInDb.save();
  response.send({ info: 'success' });
});

// Return total number of users
usersRouter.get('/totalUsers', async (req, res) => {
  const numberOfUsers = await User.countDocuments({});
  res.status(200).send({ total: numberOfUsers });
});

module.exports = usersRouter;
