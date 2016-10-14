var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var schema = require('../models/schema.js');

var driver = require('./driver');
var client = require('./client');
var vendor = require('./vendor');
router.use('/driver', driver);
router.use('/client', client);
router.use('/vendor', vendor);

router.get('/', function(req, res, next) {
    res.send('please tell us what you need');
});

router.post('/', function(req, res, next){
    schema.Ads.create(req.body, function(err, post){
        if(err) return next(err);
        res.json(post);
    });
});

/*
GET /api/ads?count=10&pos=100   
GET /api/ads?hotfive=1
GET /api/driver/:driverid/ads/
GET /api/driver/:driverid/ads/:adid
GET /api/driver/:driverid/cars/
GET /api/driver/:driverid/income
GET /api/driver/:driverid/coupon
 */
//GET /api/ads?count=10&pos=100  
router.get('/ads', function(req, res, next){
    if(req.query.count != undefined){
        console.log("query count:" + req.query.count || 'null');
        console.log("query pos:" + req.query.pos || 'null');
        var query = schema.Ads.find({});
        query.limit(req.query.count || 20);
        query.skip(req.query.pos || 0);
        query.exec(function(err, ads){
            if(err) return next(err);
            res.json(ads);
        });
    }else{
        next();
    }
});

//GET /api/ads?hotfive=1
router.get('/ads', function(req, res, next){
    if(req.query.hotfive != undefined){
        console.log("hotfive...");
        //TODO xiaosen83@gmail.com Calvin Wang
        //return the hot file accroding to rank
        var query = schema.Ads.find({});
        query.limit(5);
        query.exec(function(err, ads){
            if(err) return next(err);
            res.json(ads);
        });
    }else{
        next();
    }
});

/* GET ad listing. */
router.get('/ads', function(req, res, next) {
    console.log("ads without query")
    schema.Ads.find(function(err, ads){
        if(err) return next(err);
        res.json(ads);
    });
});

// create AD document
router.post('/ads', function(req, res, next){
    schema.Ads.create(req.body, function(err, post){
        if(err) return next(err);
        res.json(post);
    });
});

// GET ad with id=xxxx
router.get('/ads/:id', function(req, res, next) {
    schema.Ads.findById(req.params.id, function(err, ads){
        if(err) return next(err);
        res.json(ads);
    });
});

// PUT update id=xxx with content
router.put('/ads/:id', function(req, res, next){
    schema.Ads.findByIdAndUpdate(req.params.id, req.body, function(err, post){
        if(err) return next(err);
        res.json(post);
    });
});


module.exports = router;
