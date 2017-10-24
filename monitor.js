const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('datejs');
const utils = require('./lib/utils');
const datePattern = 'yyyy-MM-dd';
const config = require('./auth/config.json');
const passport = require("passport");
var session = require("express-session");
const ensure_authentication = require("connect-ensure-login");

/****************| Start of ExpressJS rubbish |******************/
//---routes
var index = require('./routes/index');
var routes = require('./routes/routes');

//---declare express as the function handler
var app = express();
/*app.get('/', function (req, res) {
  res.send('Hello World!')
});*/


//---register middlewares
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
		extended: false
	}));
app.use(cookieParser());

// Express session must be before passport session if authenticated user info is to be stored in sessions
app.use(session({
    secret: config.session_secret,
    resave: true,
    saveUninitialized: true
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());
require('./auth/passport')(passport);
app.use('/', routes);

//---view engine setup
app.set('views', path.join(__dirname, 'public')); // set view dir to public
app.use(express.static(path.join(__dirname, 'public'))); // set public path
app.engine('.html', require('ejs').renderFile); // render .html with ejs
app.set('view engine', 'html'); // set engine as html

//---handle routes
//app.use('/', index);
app.listen(4501, function () {
  console.log('Example app listening on port 4501!')
});

app.use(utils.handleNotFound);
app.use(utils.printStackTrace);

