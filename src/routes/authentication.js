import express from "express";
const passport = require('passport');
const Authentication = require('../contollers/authentication');
const requireSignIn = passport.authenticate('local', { session: false });

const router = express.Router();

router.get('/sign-up', (req, res) => {
  res.render('authentication/sign-up');
});

router.post('/sign-up', Authentication.signup);

router.get('/sign-in', (req, res) => {
  res.render('authentication/sign-in');
});

router.post('/sign-in', requireSignIn, Authentication.signin);

export default router;
