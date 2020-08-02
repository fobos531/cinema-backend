const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  auth: {
    type: 'login',
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS, // naturally, replace both with your real credentials or an application-specific password
  },
});

module.exports = transporter;
