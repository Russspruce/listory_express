var configDB = require('../config/database');
var Sequelize = require('sequelize');
// var pg = require('pg').native;
// var pghstore = require('pg-hstore');
var sequelize = new Sequelize(configDB.url);

var User   = sequelize.import('./models/user');



module.exports = function(app, passport) {

  app.get('/', function(req, res) {
    res.render('index.ejs');
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
      user : req.user
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });


  //Local login

  app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

  //Local signup

  app.get('/signup', function(req, res) {
    res.render('signup.ejs', { message: req.flash('loginMessage') });
  });

  // app.post('/signup', passport.authenticate('local-signup', {
  //   successRedirect : '/profile',
  //   failureRedirect : '/signup',
  //   failureFlash : true
  // }));

  app.post('/signup', function(req, res) {
    User.findOne({ where: { email: req.body.email }})
      .then(function(existingUser) {
// debugger;
        if (existingUser) {
          return res.render('login.ejs', { message: req.flash('loginMessage', 'That email is already being used.')});
        }
        var newUser = User.build({ firstname: req.body.firstname,
                                   lastname: req.body.lastname,
                                   email: req.body.email,
                                   image: req.body.image,
                                   password: User.generateHash(req.body.password)});
        newUser.save().then(function() {
          console.log('-----------user', newUser)
          res.redirect('/login');
        }).catch(function(err) {
          return res.render('login.ejs', { message: req.flash('loginMessage', 'Can\'t create new account at this time.')});
        });
    })
    .catch(function(e) {
      done(null, false, req.flash('loginMessage', e.name + " " + e.message));
    })

	});

  //Authorize: already logged in

  app.get('/connect/local', function(req, res) {
    res.render('connect-local.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/connect/local', passport.authenticate('local-signup', {
    successRedirect : '/profile',
    failureRedirect : '/connect/local',
    failureFlash : true
  }));

  // facebook

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));


		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

  app.get('/unlink/local', function(req, res) {
    var user      = req.user;
    user.email    = null;
    user.password = null;
    user.save()
      .then(function ()
    {res.redirect('/profile');})
    .catch(function ()
    {res.redirect('/profile');});
  });

  app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebooktoken = null;
		user.save()
			.then(function ()
			{res.redirect('/profile');})
			.catch(function ()
			{res.redirect('/profile');});
	});
};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}
