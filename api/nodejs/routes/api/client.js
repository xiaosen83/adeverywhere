
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var schema = require('../../models/schema.js');


//GET /api/client/income
router.get('/income', function(req, res){
    res.send('{income....}');
});

//GET /api/client/:clientid/ads/
router.get('/:clientid/ads', function(req, res){
    res.send('{my ads....}');
});

//POST    /api/client/request {address:"", company:"", phone:"", cars:123, period:3}
router.post('/request', function(req, res, next){
    res.send(req.body);
});


module.exports = router;