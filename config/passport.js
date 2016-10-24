
var LocalStrategy   = require('passport-local').Strategy;


var configDB = require('./database.js');
var Sequelize = require('sequelize');
var pg = require('pg').native;
var pghstore = require('pg-hstore');
var sequelize = new Sequelize(configDB.url);

var User   = sequelize.import('../app/models/user');
User.sync();


var configAuth = require('./auth');

module.exports = function(passport) {

  //passport setup

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      done(null, user);
    }).catch(function(e){
      done(e, false);
    });
  });

  // Passport Local Login

  passport.use('local-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User. findOne({ where: { email: email }})
    .then(function(user) {
      if (!user) {
        done(null, false, req.flash('loginMessage', 'Unknown user'));
      } else if (!user.validPassword(password)) {
        done(null, false, req.flash('loginMessage', 'Wrong password'));
      } else {
        done(null, user);
      }
    })
    .catch(function(e) {
      done(null, false, req.flash('loginMessage', e.name + " " + e.message));
    });
  }));

  //Passport Local signup

  passport.use('local-signup', new LocalStrategy({
    firstnameField : 'firstname',
    lastnameField : 'lastname',
    usernameField : 'email',
    imageField : 'image',
    passwordField : 'password',
    passReqToCallback: true
  },
  function(req, res, done) {
// console.log('---------------------req', req)
    User.findOne({ where: { email: req.body.email }})
      .then(function(existingUser) {
// debugger;
        if (existingUser) {
          return done(null, false, req.flash('loginMessage', 'That email is already being used.'));
        }

        if (req.user) {
          var user   = req.user;
          user.firstname = req.body.firstname;
          user.lastname = req.body.lastname;
          user.email   = req.body.email;
          user.image = req.body.image;
          user.password   = User.generateHash(req.body.password);
          user.save().catch(function (err) {
            throw err;
          }).then (function() {
            done(null, user);
          });
        } else {
          var newUser = User.build({ email: req.body.email,
                                     password: User.generateHash(req.body.password)});
          newUser.save().then(function() {
            done(null, newUser);
          }).catch(function(err) {
            done(null, false, req.flash('loginMessage', err))
          });
        }
      })
      .catch(function(e) {
        done(null, false, req.flash('loginMessage', e.name + " " + e.message));
      })
  }));


// FACEBOOK

passport.use(new FacebookStrategy({

    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL,
//enableProof: true,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

},
function(req, token, refreshToken, profile, done) {
        // check if the user is already logged in
        if (!req.user) {

            User.findOne({ where :{ 'facebookid' : profile.id }})
      .then (function (user) {
        if (user) {

          // if there is a user id already but no token (user was linked at one point and then removed)
          if (!user.facebooktoken) {
            user.facebooktoken = token;
            user.facebookname  = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebookemail = profile.emails[0].value;

            user.save()
              .then( function() {done(null, user);})
              .catch (function(e) {});
                        } else {
            done(null, user);
          }
        } else {
          // if there is no user, create them
          var newUser = User.build ({
            facebookid: profile.id,
            facebooktoken: token,
            facebookname: profile.name.givenName + ' ' + profile.name.familyName,
            facebookemail: profile.emails[0].value
          });
          newUser.save()
                .then( function() {done(null, user);})
                .catch (function(e) {});
        }
      });
        } else {
            // user already exists and is logged in, we have to link accounts
            var user            = req.user; // pull the user out of the session

            user.facebookid    = profile.id;
            user.facebooktoken = token;
            user.facebookname  = profile.name.givenName + ' ' + profile.name.familyName;
            user.facebookemail = profile.emails[0].value;

            user.save()
      .then( function() {done(null, user);})
      .catch (function(e) {});
        }
}));

};
