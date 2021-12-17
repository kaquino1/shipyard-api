require('dotenv').config();
const express = require('express');
var passport = require('passport');
const router = express.Router();

// FINISH AUTHENTICATION THEN REDIRECT TO /userinfo
router.get('/', (req, res, next) => {
    passport.authenticate('auth0', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            const returnTo = req.session.returnTo;
            delete req.session.returnTo;
            res.redirect(returnTo || '/userinfo');
        });
    })(req, res, next);
});

module.exports = router;