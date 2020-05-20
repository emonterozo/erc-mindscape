var express = require('express');
var router = express.Router();

const authCheck = (req, res, next) => {
  if(!req.user) {
    //if use is not login
    res.redirect('/auth/login');
  } else {
    next();
  }
}

/* GET users listing. */
router.get('/', authCheck, function(req, res, next) {
  //res.render('profile',{user: req.user});
  res.render('profile',{username: req.user.username, thumbnail: req.user.thumbnail});
});




module.exports = router;
