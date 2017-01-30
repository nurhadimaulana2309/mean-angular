//
// load packages here
//
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

//temporary data store
var users = {};
module.exports = function(passport){
  // Passport needs to be able to serialize and deserialize users to support persistent login sessions

  //
  // saved to session req.session.passport.user = {id:'..'}
  //
  passport.serializeUser(function(user, done) {
    console.log('serializing user:',user.username);
    return done(null, user.username);
  });

  //
  // user object attaches to the request as req.user
  // if we use devise on ruby on rails it acts the same like we call current_user
  // but for this we get it from its request (req)
  //
  passport.deserializeUser(function(username, done) {
    return done(null, users[username]);
  });

  passport.use('login', new LocalStrategy({
      passReqToCallback : true
    },
    function(req, username, password, done) {
      if(!users[username]){
        return done('User not found!', false);
      }

      if(!isValidPassword(users[username], password)){
        return done('Invalid password!', false);
      }

      //
      // successfully logged in
      //
      return done(null, users[username]);
    }
  ));

  passport.use('signup', new LocalStrategy({
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
      if(users[username]){
        return done('This username is already taken', false);
      }

      //
      // add a new users to users hash - save to local memory
      //
      users[username] = {
        username: username,
        password: createHash(password)
      }

      return done(null, users[username]);
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