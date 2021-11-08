'use strict';
const {startup} = require('./src/server.js');
// Start up DB Server
const { db } = require('./src/auth/models/index');
db.sync()
  .then(() => {

    // Start the web server
    startup(process.env.PORT);
  });