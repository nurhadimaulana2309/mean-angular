var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');

//
// create a new middleware or function to check whether user is logged in or not
// if not logged in then user doesn't have ability to access the api (post the chirp)
//
function isAuthenticated(req, res, next){
  //
  // if users is trying to access api but the method is GET its okay they can
  //
  if(req.method === "GET"){
    return next();
  }
  //
  // if users is already logged in then they will be continue to the next middleware / function
  //
  if(req.isAuthenticated()){
    return next();
  }

  //
  // if user is not logged in then he will be redirected to '/#login page'
  //
  return res.redirect('/#login');
}

//
// register the authentication middleware
// so this isAuthenticated is implemented to routes with path '/posts' only
// make sure that you put your code in the right place - i mean the sequence must be concerned
//
router.use('/posts', isAuthenticated);

//
// this is an example of a routes which has two different methods but with same path
//
router.route('/posts')

  .get(function(req, res){
    Post.find(function(err, data){
      if(err){
        return res.send(500, err);
      }

      return res.json(data);
    });
  })

  .post(function(req, res){
    var post = new Post();
    post.text = req.body.text;
    post.created_by = req.body.created_by;
    post.save(function(err, data){
      if(err){
        return res.send(500, err);
      }

      return res.json(data);
    });
  });

//
// this is an example of a routes which has three different methods but with same path
// it also bring one parameter which we can access by calling params.id
// so basically anything after /posts/ will be as req.params.id
//
router.route('/posts/:id')

  .get(function(req, res){
    Post.findById(req.params.id, function(err, data){
      if(err){
        return res.send(err);
      }

      return res.json(data);
    });
  })

  .put(function(req, res){
    //
    // if we run findById on `mongo-shell` it will not work
    //
    Post.findById(req.params.id, function(err, data){
      if(err){
        return res.send(err);
      }

      data.text = req.body.text;
      data.created_by = req.user._id;
      data.save(function(err, data){
        if(err){
          return res.send(err);
        }

        return res.json(data);
      });
    });
  })

  .delete(function(req, res){
    Post.remove({_id: req.params.id}, function(err, data){
      if(err){
        return res.send(err);
      }
      return res.json(data);
    });
  });


//
// NOTES :
// Please make sure for those routes configuration above which has more than one methods -
// per each path to put semicolon just in the end of the last route configuration
//
// For example you can check at line 15 and line 34
// You see that we didn't put semicolon at line 11, 26 or 30
//

module.exports = router;