'use strict';

const { users } = require('../models/index.js');

module.exports = async (req, res, next) => {

  console.log(req.headers.authorization+'headers =====================');
  const bearerHeaderToken = req.headers.authorization.split(' ')[1];
  
  console.log(bearerHeaderToken+'headers =====================');
  users.authenticateToken(bearerHeaderToken).then(userData => {
    req.user = userData;
    next();
  }).catch(() => {
    next('Bearer token authentication error');
  });
}