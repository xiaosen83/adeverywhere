var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var schema = require('../../models/schema.js');

router.get('/', function(req, res, next) {
    res.send('this is driver\n');
});

//GET /api/driver/:driverid/ads/
//GET /api/driver/:driverid/ads/:adid
//GET /api/driver/:driverid/cars/
//GET /api/driver/:driverid/income
//GET /api/driver/:driverid/coupon
/**
* Get Ads belong to driver
* GET /api/driver/:driverid/ads/
*/
router.get('/:driverid/ads', function(req, res){
    res.send(req.params.driverid);
});

/**
* Get Ads belong to driver
* GET /api/driver/:driverid/ads/
*/
router.get('/:driverid/ads/:adid', function(req, res){
    res.send(req.params.driverid);
});

/**
* Get Ads belong to driver
* GET /api/driver/:driverid/cars/
*/
router.get('/:driverid/cars', function(req, res){
    res.send(req.params.driverid);
});

/**
* Get Ads belong to driver
* GET /api/driver/:driverid/income
*/
router.get('/:driverid/income', function(req, res){
    res.send(req.params.driverid);
});
/**
* Get Ads belong to driver
* GET /api/driver/:driverid/coupon
*/
router.get('/:driverid/coupon', function(req, res){
    res.send(req.params.driverid);
});


//POST    /api/driver/:driverid/ads/:adid     {position:"left", carid:"xxxx"}
router.post('/:driverid/ads/:adid', function(req, res, next){
    console.log(req.params.driverid);
    console.log(req.params.adid);
    res.send(req.body);
});

//DELETE  /api/driver/:driverid/ads/:adid     {position:"left", carid:"xxxx"}

module.exports = router;