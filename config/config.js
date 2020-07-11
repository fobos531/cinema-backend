require('dotenv').config();

const { PORT } = process.env;
const { MONGODB_URI } = process.env;
const { SECRET } = process.env;

module.exports = {
  PORT, // PORT je port na kojem je pokrenut server
  MONGODB_URI,
  SECRET,
};
