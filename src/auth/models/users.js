'use strict';
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const API_SECRET = process.env.API_SECRET || 'some secret word';

const userSchema = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, },
    token: {
      type: DataTypes.VIRTUAL,
    }
  });
  // 
  //   return jwt.sign({ username: this.username },API_SECRET);
  // 

  model.beforeCreate(async (user) => {

    console.log(user.username + 'user =====================');
    let hashedPass = await bcrypt.hash(user.password, 10);
    console.log(hashedPass);
    user.password = hashedPass;

  });

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username } })
    const valid = await bcrypt.compare(password, user.password)
    if (valid) {

      let newToken = jwt.sign({ username: user.username }, API_SECRET);
      user.token = newToken
      return user;
    }
    throw new Error('Invalid User');
  }

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      console.log(token + 'token ================');
      console.log(API_SECRET + 'API_SECRET token ================');
      const parsedToken = jwt.verify(token, API_SECRET);
      console.log(parsedToken.username + 'parsedToken ================');
      const user = await this.findOne({ where: { username: parsedToken.username } })
      console.log(user + 'parsedToken ================');
      if (user.username) { return user; } else {

        throw new Error("User Not Found");
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }

  return model;
}

module.exports = userSchema;