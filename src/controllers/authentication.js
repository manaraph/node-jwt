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

const signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const saltRounds = 12;

  if (!name || !email) {
    res.status(422).send({ error: 'Please enter your email address and password'});
  }

  bcrypt.hash(password, saltRounds).then( hash => {
    return createUser(name, email, hash).then( newUser => {
      res.json({ token: tokentForUser(newUser) })
    }).catch( err => {
      res.json({ error: 'Error saving user to the database'})
    })
  }).catch( err => {
    return next(err);
  })
}

module.exports = { 
  signup, 
  siginin 
}
