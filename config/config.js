require('dotenv').config();

const { PORT } = process.env;
const { MONGODB_URI } = process.env;
const { SECRET } = process.env;
const { GMAIL_USER } = process.env;
const { GMAIL_PASS } = process.env;

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET,
  GMAIL_USER,
  GMAIL_PASS,
};
