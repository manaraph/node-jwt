const jwt = require('jwt-simple');
const config = require('../../config');
const { createUser } = require('../actions/signUp');
const bcrypt = require('bcrypt');

const tokentForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

const siginin = (req, res, next) => {
  res.send({ token: tokentForUser(req.user)});
}