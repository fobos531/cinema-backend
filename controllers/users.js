const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const passwordGenerator = require('generate-password');
const User = require('../models/user');
const mail = require('../utils/mailHelper');
const authMiddleware = require('../middleware/authentication');




// Add user
usersRouter.post('/', async (req, res) => {
  const userData = req.body;
  const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 salt rounds is default
  const newUser = new User({
    ...userData,
    passwordHash: hashedPassword,
    user_type: 'registeredUser',
  });
  const addedUser = await newUser.save();
  res.json(addedUser);
});

// This is used to update user details
usersRouter.put('/', authMiddleware, async (request, response) => {
  const userToUpdate = request.body; // novi podaci korisnika
  const idOfUserToUpdate = userToUpdate.id;
  delete userToUpdate.id;
  if (userToUpdate.password) {
    const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
    delete userToUpdate.password;
    userToUpdate.passwordHash = hashedPassword;
  }
  const userInDb = await User.findById(idOfUserToUpdate);
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

// Reset user password
usersRouter.patch('/', authMiddleware, async (request, response) => {
  const user = await User.findOne({ email: request.body.recoveryEmail });
  const newPassword = passwordGenerator.generate({
    length: 10,
    numbers: true,
  });

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.passwordHash = hashedPassword; // seats array je direktno u request.body
  const mailOptions = {
    from: 'jglavina@foi.hr',
    to: `${request.body.recoveryEmail}`,
    subject: 'Your new password',
    text: `Hello, we've resetted your password and its ${newPassword}. Enjoy!`,
  };
  mail.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
  await user.save();
  response.json(user);
});

// Return total number of users
usersRouter.get('/totalUsers', async (req, res) => {
  const numberOfUsers = await User.countDocuments({});
  res.status(200).send({ total: numberOfUsers });
});

module.exports = usersRouter;
