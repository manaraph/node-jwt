const passport = require('passport');
const config = require('../../config');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { findUserById, verifyUser } = require('../actions/signIn');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');

// Create local strategy
const localOptions = { usernameField: 'email' };

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  return verifyUser(email).then( validUser => {
    bcrypt.compare(password, validUser.password).then( validPassword => {
      if (validPassword) {
        return done(null, validUser);
      }

      done(null, false);
    }).catch( err => done(err, false));
  });
});

// Setup option for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
const jwtLogin = new JWTStrategy(jwtOptions, (payload, done) => {
  return findUserById(payload.sub).then( foundUser => {
    if (foundUser) {
      return done(null, foundUser);
    }

    return done(null, false);
  }).catch( err => done(err, false));
})

// Use this strategy in passport
passport.use(jwtLogin);
passport.use(localLogin);
