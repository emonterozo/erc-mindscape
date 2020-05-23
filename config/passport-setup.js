const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const key = require("./key");
const Model = require("../models/model");

/*
    It will run after the passport.authenticate
    After authentication save _id of user to the session   
*/
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

/*
    It will run after the passport.serializeUser
    It will attach the user to the req as req.user
    then it will go back to auth,js then run the next function
*/
passport.deserializeUser(function(id, done) {
  Model.UserData.findById(id).then(function(user) {
    done(null, user);
  });
});

/* Local Strategy */
passport.use(
  "local-login",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: "number",
      passwordField: "password",
      passReqToCallback: true, // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function (req, number, password, done) {
      // asynchronous
      //console.log(password);
      process.nextTick(function () {
        Model.UserData.findOne({ number: number }, function (err, user) {
          if(!user) {
            return done(null, false);
          } else {
            bcrypt.compare(password, user.password, function (err, result) {
              if (result == true) {
                return done(null, user);
              } else {
                return done(null, false);
              }
            });
          }
        });
      });
    }
  )
);

/* Google Strategy */
passport.use(
  new GoogleStrategy(
    {
      // options for google strategy
      clientID: process.env.GOOGLE_CLIENT_ID || key.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || key.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    function (accessToken, refreshToken, profile, done) {
      // passport callback function
      Model.UserData.findOne({ google_id: profile.id }, function (err, user) {
        if (user) {
          done(null, user);
        } else {
          new Model.UserData({
            name: profile.displayName,
            google_id: profile.id,
            t_stat: 0,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);


/* Facebook Strategy */
passport.use(
  new FacebookStrategy(
    {
      // options for google strategy
      clientID: process.env.FACEBOOK_CLIENT_ID || key.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || key.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/redirect"
    },
    function (accessToken, refreshToken, profile, done) {
      // passport callback function
      
      Model.UserData.findOne({facebook_id: profile.id }, function (err, user) {
        if (user) {
          done(null, user);
        } else {
          new Model.UserData({
            name: profile.displayName,
            facebook_id: profile.id,
            t_stat: 0,
          })
            .save()
            .then((newUser) => {
              done(null, newUser);
            });
        }
      });
    }
  )
);
