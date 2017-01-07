
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var schema = require('../../models/schema.js');

//POST    /api/vendor/ads/:adid/driver/:driverid {action:"install"}
router.post('/ads/:adid/driver/:driverid', function(req, res, next){
    res.send(req.body);
});

//POST    /api/vendor/ads/:adid/driver/:driverid {action:"uninstall"}
router.post('/ads/:adid/driver/:driverid', function(req, res, next){
    res.send(req.body);
});

module.exports = router;