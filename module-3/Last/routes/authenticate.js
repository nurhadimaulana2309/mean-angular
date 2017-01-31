var mongoose = require('mongoose');
var User = mongoose
var express = require('express');
var router = express.Router();

//
// instead of we do module.exports = router;
// we can do like below where we export routes configuration inside a function
//
module.exports = function(passport){

  //
  // sends successful login state back to angular
  // req.user is coming from passport.deserializeUser() where it returns user data
  // also this is another way how we use router configuration with one path and one method
  //
  router.get('/success', function(req, res){
    res.send({state: 'success', user: req.user ? req.user : null});
  });

  //
  // sends failure login state back to angular
  //
  router.get('/failure', function(req, res){
    res.send({state: 'failure', user: null, message: 'Invalid username or password'});
  });

  //
  // log in process
  //
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/authenticate/success',
    failureRedirect: '/authenticate/failure'
  }));

  //
  // sign up process
  //
  router.post('/signup', passport.authenticate('signup',{
    successRedirect: '/authenticate/success',
    failureRedirect: '/authenticate/failure'
  }));

  //
  // sign out process
  //

  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};