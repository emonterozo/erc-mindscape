var express = require("express");
var router = express.Router();


var Model = require("../models/model")


var userHolder;
let errors, success = false;

/* GET home page. */
router.get("/", function (req, res, next) {
res.render("index", { title: "Mindscape", version: "2.0.0" });
});

/* POST Login */
router.post("/login/submit", function (req, res, next) {
  userHolder = req.body.uname;

  Model.UserData.findOne({user: userHolder}, function(err, user){
    if(user != null) {
      res.redirect('/home');
    } else {
      res.redirect("/create")
    }
  })
});

router.get("/create", function(req, res, next){
  res.render("create_account", { data: userHolder, title: "Mindscape", success: success, errors: errors});
  errors = null
})

router.post("/create/submit", function (req, res, next) {
  
  //const uname = req.body.uname;
  userHolder = req.body.uname;
  const fname = req.body.fname;

  Model.UserData.findOne({user: userHolder}, function(err, user){
    if(user != null) {
      errors = `Username already exists`;
      success = false;
      res.redirect('/create')
    } else {
      let user = {
        user: userHolder,
        name: fname,
        t_stat: 0,
        history:[]
      }
      var newUser = new Model.UserData(user);
      newUser.save();
      res.redirect('/home');
    }
  });
});




module.exports = router;
