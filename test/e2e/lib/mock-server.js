'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.route('/server-artifact-id/resource')
  .get(function (req, res) {
    res.send({});
  })
  .post(function (req, res) {
    res.send({});
  });

app.listen(process.argv[2] || 3000);

