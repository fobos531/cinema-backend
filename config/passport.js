const bcrypt = require('bcrypt');
const config = require('./config');

const BCRYPT_SALT_ROUNDS = 10;

const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const exctractJwt = require('passport-jwt').Strategy;
const User = require('../models/user');

passport.use(
  'register',
  new localStrategy(
    username: 'username',
    password: 'password',
    session: false,
  ),
  async (username, password, done) => {
    try {
      let user = await User.findOne({ username: username})
      if (user !== null) {
        console.log("username already taken");
        return done(null, false, { error: "username already taken! "})
      } else {
        let hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
        const newUser = new User()
      }
    }
  }
)