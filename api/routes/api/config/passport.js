var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var schema = require('../../../models/schema');

passport.use(new LocalStrategy(
  function(username, password, done) {
    schema.Users.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      console.log('try to login with username:' + username)
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));