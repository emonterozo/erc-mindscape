var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var key = require('./key');
var Model = require("../models/model");


    passport.serializeUser((user, done) => {
        done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		Model.User.findById(id).then((user) => {
			done(null, user);
		});
	});


passport.use(
    new GoogleStrategy({
        // options for google strategy
        clientID: key.google.clientID,
        clientSecret: key.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {
        // passport callback function
        //check user
        //console.log(profile); 
        Model.User.findOne({googleID: profile.id}, function(err, user){
            if(user){
                // already have this user
                console.log('user is: ', user);
                // do something
                done(null, user);
            } else {
                new Model.User({
                    username: profile.displayName,
                    googleID: profile.id,
                    thumbnail: profile._json.picture
                }).save().then((newUser) => {
                    console.log('new user created'+newUser)
                    done(null, newUser);
                })
            }
        });

        
    })
);