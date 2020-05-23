const express = require("express");
const router = express.Router();

const key = require("../config/key");
const twilio = require("twilio");
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || key.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN || key.TWILIO_AUTH_TOKEN
);

const bcrypt = require("bcrypt");
const salt = 10;

const Model = require("../models/model")


let errors, success = false;

/*  It will check the cookie if the session still there
    For automatic login
*/
const authCheck = (req, res, next) => {
  if(req.user) {
    res.redirect('/profile');
  } else {
    next();
  }
}

/* it will run the authCheck first */
router.get("/", authCheck, function (req, res, next) {
res.render("index", { title: "Mindscape", version: "2.0.0" });
});


router.get("/create", function(req, res, next){
  res.render("create_account", {success: success, errors: errors, title: "Mindscape"});
  errors = null
})

/* 
    Check if mobile number exist
    Send the verification code
    Render verification 
*/
router.post("/create/submit", function (req, res, next) {
  
  const userData = req.body;
  Model.UserData.findOne({number: req.body.unumber}, function(err, user){
    if(user != null) {
      errors = 'Mobile number already exist';
      success = false;
      res.redirect('/create')
    } else {
      const verificationCode = rand(1000, 9000);
      Model.UserNumber.findOneAndDelete({number: userData.unumber}, (err) => {
        bcrypt.hash(userData.upass, salt, function (err, hash){
          /* Encrypt password using hash */
          Model.UserNumber.create({name: userData.uname, number: userData.unumber, code: verificationCode, 
            password: hash}, function(err, number) {
            const params = {
              to: userData.unumber,
              from: process.env.TWILIO_NUMBER || key.TWILIO_NUMBER, // Your twilio phone number
              body: verificationCode
            };
            
            twilioClient.messages.create(params, (err, message) => {
              if (err) {
                console.log(err);
                res.status(500).send(err);
              } else {
                res.render('verification',{number: userData.unumber, code: verificationCode});
              }
            });
            //res.render('verification',{number: userData.unumber, code: verificationCode});
          });
          
        })
      });
    }
  });

});

/* 
  Compare the code
  and Automatically login the user 
*/
router.post("/verifycode", function (req, res, next) {
  const data = req.body.code.toString();
  const code = data.replace(/,/g, "");
  Model.UserNumber.findOne({number: req.body.number}, function(err,user) {
    if(code == user.code) {
      new Model.UserData({name: user.name, number: user.number, password: user.password})
      .save().then(function(newUser){
        Model.UserNumber.findOneAndDelete({number: user.number}, (err) => {
            /* automatically login the user */
          req.login(newUser, function(err) {
            if (err) {
              console.log(err);
            }
            return res.redirect('/profile');
          });
        });
      })
    } else {
      console.log('not correct');
    }
  
  });
});

/* It will return the 6 digit generated code */
let rand = function(low, high) {
  return Math.floor(low + Math.random() * high);
};


module.exports = router;
