const jwt = require('jsonwebtoken');
const User = require('../models/user');

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
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
    res.sendStatus(401).send({ error: 'invalid username or password! ' });
  }
};

module.exports = isAuthenticated;
