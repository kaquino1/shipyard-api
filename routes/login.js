require('dotenv').config();
const express = require('express');
var passport = require('passport');
const router = express.Router();

// REDIRECT TO AUTH0 LOGIN THEN REDIRECT TO CALLBACK
router.get(
  '/',
  passport.authenticate('auth0', {
    scope: 'openid email profile'
  }),
  (req, res) => {
    res.redirect('/');
  }
);

module.exports = router;
