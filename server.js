  var express = require('express');
  var app = express();
  var port = process.env.PORT || 5000;
  var passport = require('passport');
  var flash = require('connect-flash');

  //Added


  var morgan = require('morgan');
  var cookieParser = require('cookie-parser');
  var bodyParser = require('body-parser');
  var session = require('express-session');

  require('./config/passport')(passport);


  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser());

  app.set('view engine', 'ejs');

  app.use(session({ secret: 'bringallthegoodstothepartysowecanparty'}))
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  require('./app/routes.js')(app, passport);

  app.listen(port);
  console.log('Serving now on port ' + port);
