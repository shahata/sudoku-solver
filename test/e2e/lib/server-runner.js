'use strict';

var spawn = require('child_process').spawn;
var serverProcess;

beforeEach(function () {
  serverProcess = spawn('node', ['test/e2e/lib/mock-server.js', '3333']);
});

afterEach(function () {
  serverProcess.kill();
});
