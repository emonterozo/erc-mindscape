var express = require('express');
var router = express.Router();

var Model = require("../models/model");

const authCheck = (req, res, next) => {
  if(!req.user) {
    //if use is not login
    res.redirect('/');
  } else {
    next();
  }
}

/* GET Subject and User */
router.get('/', authCheck, function(req, res, next) {
  //res.render('profile',{user: req.user});
  Model.QuestionData.find({},'subject',function(err,subjects){
    const subject = subjects.map(function(subj){
      return subj.subject;
    })
    
    res.render('profile',{name: req.user.name, id: req.user._id, t_stat: req.user.t_stat, categories: subject});
  });
});


/* Get History */
router.get("/history/:account",function(req, res, next) {
  Model.UserGoogle.findById({_id: req.query.account}).lean()
  .exec(function(err, user){
    res.render("history",{data: user.history});
  });
});

/* Select Category and Generate Question */
router.get("/questions/:category", function (req, res, next) {
  Model.UserGoogle.findById({_id: req.query.user}, function(err, user){
    if(user != null) {
      if (req.query.category === "random") {
        Model.QuestionData.countDocuments({}, function(err, subjCount){
          const categoryRandom = Math.floor(Math.random() * subjCount);
          Model.QuestionData.find({},function(err,subject){
            const questionRandom = Math.floor(Math.random() * subject[categoryRandom].questions.length);
            const quest = subject[categoryRandom].questions[questionRandom].question;
            const choices = subject[categoryRandom].questions[questionRandom].choices;
            const correct = subject[categoryRandom].questions[questionRandom].correct;
            res.render("questions", {
              random: true,
              category: subject[categoryRandom].subject,
              question: quest,
              choices: choices,
              correct: correct,
              user: req.query.user
            });
          });
        });
      } else {
        Model.QuestionData.findOne({subject: req.query.category},function(err,subject){
          //console.log(subjects.questions.length);
          const questionRandom = Math.floor(Math.random() * subject.questions.length);
          const quest = subject.questions[questionRandom].question;
          const choices = subject.questions[questionRandom].choices;
          const correct = subject.questions[questionRandom].correct;
          res.render("questions", {
            random: false,
            category: req.query.category,
            question: quest,
            choices: choices,
            correct: correct,
            user: req.query.user
          });
        });
      }
    } else {
      res.render("error", { message: `Username ${req.query.user} not exist`})
    }
  });
});



module.exports = router;
