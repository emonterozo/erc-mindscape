var express = require('express');
var router = express.Router();

var Model = require("../models/model");


router.post("/account/updatestat", function(req, res, next){
    Model.UserData.findById({_id: req.body.user}, function(err,user){
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
  router.post("/account/inserthistory", function(req, res, next){
  userHolder = req.body.user;
  const dataHistory = req.body;
  delete dataHistory.user;
    Model.UserData.findByIdAndUpdate({_id: userHolder}, {$push: { history: dataHistory}}, function(err, success){
      if(err) {
        console.log(err);
      } else {
        console.log(success);
        res.end();
      }
    })
  });
  


module.exports = router;
