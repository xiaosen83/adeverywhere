var fs = require('fs');
var schema = require('../../models/schema.js');
var express = require('express');
var router = express.Router();
var multer = require('multer');

var jwt = require('express-jwt');
var auth = jwt({
  secret: 'SECRET_CWANG',
  userProperty: 'payload'
});
var AUTH = true

//////////////////following are protected API, which need authed//////////////////////////////
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
var cpUpload = upload.fields([{ name: 'head_icon', maxCount: 1 }, { name: 'logo', maxCount: 1 }])

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("users without query:" + req.payload)
    if (AUTH && (!req.payload || !req.payload._id)) {
        res.status(401).json({
            "message": "Unauthorized access!"
        })
    } else {
        console.log('payload id:' + req.payload._id)
        schema.Users.find(function(err, users){
            if(err) return next(err);
            res.json(users);
        });        
    }
});

// GET /user/:id
router.get('/:id', function(req, res, next) {
    schema.Users.findById(req.params.id, function(err, user){
        if(err) {
            console.log("Error: find user failed with id:" + req.params.id)
            return next(err);
        }
        res.json(user);
    });
});

// DELETE id=xxx with content
router.delete('/:id', function(req, res, next){
    console.log('delete user with id:'+JSON.stringify(req.params.id));
    schema.Users.findById(req.params.id, function(err, user){
        if(err) return next(err);
        schema.Users.remove({'_id': req.params.id}, function(err, post){
            if(err) return next(err);
            // TODO: delele images for logo and model
            if (user.head_icon != undefined && fs.existsSync('public/images/heads/' + user.head_icon)) {
                fs.unlinkSync('public/images/heads/' + user.head_icon)                
            }
            res.status(204).end();
        });        
    });     
});

router.put('/:id', upload.any(), function(req, res, next){
    console.log('update user id:'+JSON.stringify(req.params));
    console.log('req.files:'+JSON.stringify(req.files));
    console.log(req.body);

    var file_head = -1,
        file_id = -1;
    if(req.files && req.files.length >0){
        if(req.files[0].fieldname == 'head_icon') {
            file_head = 0;          
        } else if (req.files[0].fieldname == 'id_image') {
            file_id = 0;
        }
        if (req.files.length > 1) {
            if(req.files[1].fieldname == 'head_icon') {
                file_head = 1
            } else {
                file_id = 1
            }
        }
    }
    if (req.body.basic_info === undefined) {
        req.body.basic_info = {}
    } else {
        req.body.basic_info = JSON.parse(req.body.basic_info)
    }
    if (req.body.cert_info === undefined) {
        req.body.cert_info = {}
    } else {
        req.body.cert_info = JSON.parse(req.body.cert_info)
    }
    if (req.body.car_ids === undefined) {
        req.body.car_ids = []
    } else {
        // req.body.car_ids = req.body.car_ids
    }
        
    if(file_head != -1){
        fs.renameSync(req.files[file_head].destination+req.files[file_head].filename, 
            './public/images/heads/'+req.files[file_head].filename);
        req.body.basic_info.head_icon = req.files[file_head].filename;
    }
    if(file_id != -1){
        fs.renameSync(req.files[file_id].destination+req.files[file_id].filename, 
            './public/images/ids/'+req.files[file_id].filename);
        req.body.cert_info.id_image = req.files[file_id].filename;
    }
    console.log(req.body.basic_info);
    schema.Users.findByIdAndUpdate(req.params.id, req.body, function(err, post){
        if(err) return next(err);
        res.status(204).end(); 
    });   
});

// GET /user/:id
router.get('/:id/cars', function(req, res, next) {
    schema.Users.findById(req.params.id, function(err, user){
        if(err) {
            console.log("Error: find user failed with id:" + req.params.id)
            return next(err);
        }
        console.log("Found user (car):" + JSON.stringify(user))
        if (user.car_ids && user.car_ids.length > 0) {
            schema.Cars.find({_id: { $in: user.car_ids }}, function(err1, cars){
                if(err1) return next(err1);
                res.json(cars)
            })
        } else {
            res.status(204).end();
        }
    })
});

module.exports = router;
