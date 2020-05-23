const express = require("express");
const router = express.Router();
const passport = require('passport');


/*  
    auth logout
    destroy the session stored in cookie
*/
router.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/');
});

/* auth using google starategy  */
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));

/*  
    callback route for google to redirect to (Setup in Google API)
    hand control to passport to use code to grab profile info
*/
router.get('/google/redirect', passport.authenticate('google'), function (req, res) {
    res.redirect('/profile');
});


/* auth using facebook starategy  */
router.get("/facebook", passport.authenticate("facebook"));

/*  
    callback route for google to redirect to (Setup in Google API)
    hand control to passport to use code to grab profile info
*/
router.get('/facebook/redirect', passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/"
  })
);

/* auth using local strategy */
router.post('/local', passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/'
}));

module.exports = router;