var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: String,
  password: String, // hash created from password
  created_at: {type: Date, default: Date.now}
});

var postSchema = mongoose.Schema({
  text: String,
  created_by: String,
  created_at: {type: Date, default: Date.now}
});

//
// this is some kind of export function so we can call User and Post from another .js file
//
mongoose.model('User', userSchema);
mongoose.model('Post', postSchema);