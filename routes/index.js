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

//Done Change to post and do PRG
router.get("/questions/:category", function (req, res, next) {
  Model.UserData.findOne({user: req.query.user}, function(err, user){
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

//Done
router.get("/history/:account",function(req, res, next) {
  Model.UserData.findOne({user: req.query.account}).lean()
  .exec(function(err, user){
    res.render("history",{data: user.history});
  });
});

//
router.post("/update/stat", function(req, res, next){
  Model.UserData.findOne({user: req.body.user}, function(err,user){
    if (err) {
      console.error('error, no entry found');
    }
    let t_stat = 0, h_item = 0;
    user.history.forEach(function(history){
      t_stat += parseInt(history.h_stat);
      h_item++;
    }); 
    t_stat = t_stat/h_item;
    user.t_stat = Math.round(t_stat);
    user.save();
    res.end();
  });
});

//Done connected to update stat
router.post("/account/data", function(req, res, next){
userHolder = req.body.user;
const dataHistory = req.body;
delete dataHistory.user;
  Model.UserData.updateOne({user: userHolder}, {$push: { history: dataHistory}}, function(err, success){
    if(err) {
      console.log(err);
    } else {
      console.log(success);
      res.end();
    }
  })
});

//Done
router.get("/home", function(req, res, next){
  Model.UserData.findOne({user: userHolder}, function(err, user){
    if(user != null) {
      //console.log("not null")
      Model.QuestionData.find({},'subject',function(err,subjects){
        const subject = subjects.map(function(subj){
          return subj.subject;
        })
        const userDatas = {
          user: user.user,
          name: user.name,
          t_stat: user.t_stat
        };
        //console.log(userDatas);
        res.render("home", {data: userDatas, categories: subject});
      });
    } 
  });
});



module.exports = router;
