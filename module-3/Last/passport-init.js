//
// load packages here
//
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

//temporary data store
var users = {};
module.exports = function(passport){
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions

  //
  // saved to session req.session.passport.user = {id:'..'}
  //
  passport.serializeUser(function(user, done) {
    console.log('serializing user:', user._id);
    return done(null, user._id);
  });

  //
  // user object attaches to the request as req.user
  // if we use devise on ruby on rails it acts the same like we call current_user
  // but for this we get it from its request (req)
  //
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, data){
      if(err){
        return done(err, false);
      }

      if(data == null){
        return done('User not found', false);
      }

      return done(null, data);
    });
  });

  passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {

      User.findOne({username: username}, function(err, data){
        if(err){
          console.log('an error occured' + err);
          return done(null, false);
        }

        if(data == null){
          console.log('username ' + username + ' is not found!');
          return done(null, false);
        }

        if(!isValidPassword(data, password)){
          console.log('incorrect password!');
          return done(null, false);
        }

        return done(null, data);
      });
    }
  ));

  passport.use('signup', new LocalStrategy({
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {

      User.findOne({username: username}, function(err, data){
        if(err){
          console.log('an error occured ' + err)
          return done(null, false);
        }

        if(data){
          console.log('username already taken!');
          return done(null, false);
        }

        var user = new User();
        user.username = username;
        user.password = createHash(password);
        user.save(function(err, data){
          if(err){
            console.log('an error occured ' + err)
            return done(null, false);
          }

          console.log('user ' + user.username + ' successfully created!');
          return done(null, user);
        });

      });

    })
  );

  var isValidPassword = function(user, password){
    return bCrypt.compareSync(password, user.password);
  };
  // Generates hash using bCrypt
  var createHash = function(password){
    return bCrypt.hashSync(password, bCrypt.genSaltSync(  ), null);
  };
};