// Vendor
const express = require('express');
const nodeMailer = require('nodemailer');

// Internal
const isTestEnv = require('./helpers').isTestEnv;
const {
  GET_REQUEST_STRING,
  TEST_EMAIL,
  TEST_HOST,
  TEST_PORT,
  TEST_PWD
} = require('./constants');

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set as env variables via AWS Lambda console
const { PWD, USER } = process.env

let transporter;

if (isTestEnv(process)) {
    // For testing purposes, we set up a ethereal.email account
    transporter = nodeMailer.createTransport({
      host: TEST_HOST,
      port: 587,
      auth: {
        user: TEST_EMAIL,
        pass: TEST_PWD
      }
    });
} else {
  transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
      user: USER, // Set as env variables via AWS Lambda console
      pass: PWD
    }
  });
}

app.get('/', (req, res) => {
  res.status(200).send(GET_REQUEST_STRING);
});

app.post('/', (req, res) => {
  const { body, subject, to } = req.body;
  const mailOptions = {
    from: isTestEnv(process) ? TEST_EMAIL : USER,
    text: body,
    to,
    subject
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      console.log('ERROR', err);
      res.status(400).send(`Sorry, we have error: ${err}`);
    } else {
      console.log('Success! ', info);
      res.status(200).send(`Success! Your message to ${info.accepted[0]} has been sent! ${info.response}`);
    }
  });
});

module.exports = app;
