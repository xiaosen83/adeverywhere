var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var multer = require('multer');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var schema = require('../../models/schema.js');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'SECRET_CWANG',
  userProperty: 'payload'
});

router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); 

var driver = require('./driver');
var client = require('./client');
var vendor = require('./vendor');
var authentication = require('./authentication');
router.use('/driver', driver);
router.use('/client', client);
router.use('/vendor', vendor);
router.use('/auth', authentication);

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});
var upload = multer({ //multer settings
                storage: storage
            });//.single('file');
var cpUpload = upload.fields([{ name: 'model', maxCount: 1 }, { name: 'logo', maxCount: 1 }])

router.get('/', function(req, res, next) {
    res.send('please tell us what you need');
});

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
router.get('/ads', auth, function(req, res, next) {
    console.log("ads without query:" + req.payload)
    if (!req.payload || !req.payload._id) {
        res.status(401).json({
            "message": "Unauthorized access!"
        })
    } else {
        console.log('payload id:' + req.payload._id)
        schema.Ads.find(function(err, ads){
            if(err) return next(err);
            res.json(ads);
        });        
    }
});

// create AD document
/*
{ model:
   [ { fieldname: 'model',
       originalname: 'test_ad4.jpg',
       encoding: '7bit',
       mimetype: 'image/jpeg',
       destination: './uploads/',
       filename: '1475735910859.jpg',
       path: 'uploads/1475735910859.jpg',
       size: 6300 } ],
}
*/
router.post('/ads', cpUpload, function(req, res) {
    console.log('create AD...')
    if(req.files.model != undefined){
        console.log('upload model:' + req.files.model[0].destination+req.files.model[0].filename)
        fs.renameSync(req.files.model[0].destination+req.files.model[0].filename, 
            './public/images/models/'+req.files.model[0].filename);
        req.body.model = req.files.model[0].filename;
    }

    if(req.files.logo != undefined){
        console.log('upload logo:' + req.files.logo[0].destination+req.files.logo[0].filename)
        fs.renameSync(req.files.logo[0].destination+req.files.logo[0].filename, 
            './public/images/logos/'+req.files.logo[0].filename);
        req.body.logo = req.files.logo[0].filename;
    }  
    console.log(req.body);
    //res.status(200).end()

    schema.Ads.create(req.body, function(err, post){
        if(err) res.json(err);
        //res.json(post);
        res.status(204).end();
    });
    //res.status(204).end();
});

// GET ad with id=xxxx
router.get('/ads/:id', function(req, res, next) {
    schema.Ads.findById(req.params.id, function(err, ads){
        if(err) return next(err);
        res.json(ads);
    });
});

// PUT update id=xxx with content
router.put('/ads/:id', upload.any(), function(req, res, next){
    console.log('update ad id:'+JSON.stringify(req.params));
    console.log('req.files:'+JSON.stringify(req.files));
    console.log('body:'+JSON.stringify(req.body));

    var update_logo = -1, update_model = -1;
    if(req.files && req.files.length >0){
        if(req.files[0].fieldname == 'model')
            update_model = 0;
        else
            update_logo = 0;
        if(req.files.length >1){
            if(req.files[1].fieldname == 'model')
                update_model = 1;
            else
                update_logo = 1;            
        }
    }
    if(update_model != -1){
        fs.renameSync(req.files[update_model].destination+req.files[update_model].filename, 
            './public/images/models/'+req.files[update_model].filename);
        req.body.model = req.files[update_model].filename;
    }
    if(update_logo != -1){
        fs.renameSync(req.files[update_logo].destination+req.files[update_logo].filename, 
            './public/images/logos/'+req.files[update_logo].filename);
        req.body.logo = req.files[update_logo].filename;
    }  
    console.log(req.body);
    schema.Ads.findByIdAndUpdate(req.params.id, req.body, function(err, post){
        if(err) return next(err);
        res.status(204).end(); 
    });   
});

// DELETE id=xxx with content
router.delete('/ads/:id', function(req, res, next){
    console.log('delete ad with id:'+JSON.stringify(req.params.id));
    schema.Ads.findById(req.params.id, function(err, ads){
        if(err) return next(err);
        console.log('delete AD:' + ads)
        schema.Ads.remove({'_id': req.params.id}, function(err, post){
            if(err) return next(err);
            // delele images for logo and model
            if (ads.logo != undefined && fs.existsSync('public/images/logos/' + ads.logo)) {
                fs.unlinkSync('public/images/logos/' + ads.logo)                
            }
            if (ads.model != undefined && fs.existsSync('public/images/models/' + ads.model)) {
                fs.unlinkSync('public/images/models/' + ads.model)                
            }
            res.status(204).end();
        });        
    });     
});

module.exports = router;
