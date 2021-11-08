'use strict';

const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const { users } = require('./models/index.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer')

authRouter.post('/signup', async (req, res, next) => {
  try {
     
    console.log(req.body.username+'req =========================');
    const userRecord = await users.create(req.body);
    console.log(userRecord+'userrecord =========================');
    const output = {
      user: userRecord,
      token: userRecord.token
    };
    res.status(200).json(output);
  } catch (e) {
    next(e.message);
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    // token: req.user.token
  };
  res.status(200).json(user);
});

authRouter.get('/users', bearerAuth, async (req, res, next) => {
  const user = await users.findAll({});
  console.log(users+'users ====================================');
  const list = user.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;