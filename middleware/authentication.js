const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', ''); // remove bearer from authorization header to get only the token
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' });
    }
    const user = await User.findById(decodedToken.id);
    req.token = token;
    req.user = user;
    req.isAuthenticated = true;
    next();
  } catch {
    res.send(401).send({ error: 'invalid username or password! ' });
  }
};

module.exports = isAuthenticated;
