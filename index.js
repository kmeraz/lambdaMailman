// Vendor
var express = require('express');
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', function(req, res) {
  console.log('THIS IS REQ', req.body);
  res.send(req.body);
});

app.post('/', function(req, res) {
  console.log('THIS IS REQ.BODY', req);
  const { body, subject, to } = req.body;
  res.send('THIS IS REQ:' + body + subject + to);
});

module.exports = app;
