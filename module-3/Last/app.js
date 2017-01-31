var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//
// load packages here
//
var passport = require('passport');
var session = require('express-session');

//
// connect to mongodb
// we have to install mongodb server too - 'sudo apt-get install mongodb-server'
// it could be 'localhost:27017' or try '127.0.0.1' so problems may occurs
//
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chrip-test');
require('./models/models');

//
// load routes here
//
var index = require('./routes/index');
var api = require('./routes/api');
//
// require a file with a param because this authenticate route need a params passport
// so we require it like how we wrote it below
//
var authenticate = require('./routes/authenticate')(passport);

///////////////////////////////////////////////////////////////////
// Load Middleware
///////////////////////////////////////////////////////////////////

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

var initPassport = require('./passport-init');
initPassport(passport);

//
// configure path with specific routes loaded above
//
app.use('/', index);
app.use('/api', api);
app.use('/authenticate', authenticate);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
