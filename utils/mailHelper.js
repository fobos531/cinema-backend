const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    type: 'login',
    user: config.GMAIL_USER,
    pass: config.GMAIL_PASS, // naturally, replace both with your real credentials or an application-specific password
  },
});

module.exports = transporter;
