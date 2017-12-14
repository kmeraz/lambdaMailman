// Vendor
var express = require('express');
var nodeMailer = require('nodemailer');
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

var transporter = nodeMailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER, // Set as env variables via AWS Lambda console
    pass: process.env.PWD
  }
});

app.get('/', function(req, res) {
  var infoString = 'Hi! Please make a post request with the following params on the request body: to, subject and body.';

  res.status(200).send(infoString);
});

app.post('/', function(req, res) {
  const { body, subject, to } = req.body;

  var mailOptions = {
    from: process.env.USER,
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
      res.status(200).send('Success! Your message to ' + info.accepted[0] +
        ' has been sent! ' + info.response);
    }
  });
});

module.exports = app;
