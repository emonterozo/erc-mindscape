var express = require("express");
var router = express.Router();
var passport = require('passport');


// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    req.logOut();
    res.redirect('/');
});

// auth with google+
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

// callback route for google to redirect to
// hand control to passport to use code to grab profile info
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    res.redirect('/profile');
});

module.exports = router;