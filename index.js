// Vendor
const express = require('express');
const nodeMailer = require('nodemailer');

// Internal
const isTestEnv = require('./helpers').isTestEnv;

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set as env variables via AWS Lambda console
const { PWD, USER } = process.env

let transporter;

if (isTestEnv(process)) {
    // For testing purposes, we set up a ethereal.email account
    transporter = nodeMailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'efetmhkydc4mcsi4@ethereal.email',
        pass: 'TygsX3119pKgXTSRaN'
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

app.get('/', function(req, res) {
  const infoString = 'Hi! Please make a post request with the following params on the request body: to, subject and body.';

  res.status(200).send(infoString);
});

app.post('/', function(req, res) {
  const { body, subject, to } = req.body;
  const mailOptions = {
    from: isTestEnv(process) ? 'efetmhkydc4mcsi4@ethereal.email' : USER,
    text: body,
    to,
    subject
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if(err) {
      console.log('ERROR', err);
      res.status(400).send('Sorry, we have error:' + err);
    } else {
      console.log('Success! ', info);
      res.status(200).send(`Success! Your message to ${info.accepted[0]} has been sent! ${info.response}`);
    }
  });
});

module.exports = app;
