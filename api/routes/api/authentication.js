var express = require('express');
var router = express.Router();
var passport = require('passport')

var mongoose = require('mongoose');
var schema = require('../../models/schema.js');

router.get('/', function(req, res){
  res.send('{auth....}\n');
});

//POST /api/auth/login
router.post('/login', function(req, res){
  console.log(req.body);
  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);
});

//POST /api/auth/register
router.post('/register', function(req, res){
  console.log('register user...')
  console.log(req.body)
  var user = new schema.Users
  user.username = req.body.username
  user.setPassword(req.body.password)
  if (user.username !== 'admin' && user.username !== 'cwang')
    user.role = 'client'
  else
    user.role = 'admin'
  var basic_info = {}
  basic_info.email = 'cwang@sonicwall.com'
  basic_info.phone = '139999999'
  user.basic_info = basic_info
  user.save(function(err){
    var  token = user.generateJwt()
    console.log('token:' + token)
    res.status(200)
    res.json({"token": token})
  })
});

router.post('/logout', function(req, res){
  console.log('logout..., playload:' + JSON.stringify(req.payload))
  var item = { 'name': req.payload.name, 'exp': req.payload.exp }
  schema.BlackList.create(item, function(err, post){
      if(err) res.json(err);
      res.status(204).end();
  });
})

module.exports = router;