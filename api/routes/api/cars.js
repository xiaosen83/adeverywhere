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

// route /auth/xxxx are not protected, other router are protected, 
// /auth/logout also protected, as it need to decode the token and get the token need to logout
var authNeeded = true;
if (process.env.AUTH !== 'false') {
    // default true, false for development
    console.log("Auth enabled!")
    router.use(auth.unless({ path: /auth\/(?!logout)/i }))   
} else {
    console.log('Auth disabled')
    authNeeded = false; 
}

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

/* GET cars listing. */
router.get('/', function(req, res, next) {
    //cwang: testing purpose without auth
    /*
    schema.Cars.find(function(err, cars){
        if(err) return next(err);
        res.json(cars);
    })
    return;
    */
    
    console.log("cars without query:" + req.payload)
    if (authNeeded && (!req.payload || !req.payload._id)) {
        res.status(401).json({
            "message": "Unauthorized access!"
        })
    } else {
        console.log('payload id:' + ((req.payload)?req.payload._id:'null'))
        schema.Cars.find(function(err, users){
            if(err) return next(err);
            res.json(users);
        });        
    }
});

// GET /car/:id
router.get('/:id', function(req, res, next) {
    schema.Cars.findById(req.params.id, function(err, user){
        if(err) return next(err);
        res.json(user);
    });
});

// DELETE /car/:id  ----id=xxx with content
router.delete('/:id', function(req, res, next){
    console.log('delete car with id:'+JSON.stringify(req.params.id));
    schema.Cars.findById(req.params.id, function(err, user){
        if(err) return next(err);
        schema.Cars.remove({'_id': req.params.id}, function(err, post){
            if(err) return next(err);
            // remove from User table
            schema.Users.update({}, {$push: {car_ids: req.params.id}}, function(err, post){
                if(err) return next(err)
                res.status(204).end();
            });
        });        
    });     
});

//POST /cars
// body:{"plate_number" : "沪K5235", "model" : "Audi Q5", "user_id": "xxxxxxxxxxxxxxxxxxx"}
router.post('/', function(req, res){
  console.log('create car...')
  console.log(req.body)
  var car = new schema.Cars
  console.log("new car id:" + car._id)
  car.plate_number = req.body.plate_number
  car.model = req.body.model
  car.save(function(err){
    if(err) return next(err)
    // attach car_id to user
    schema.Users.findOneAndUpdate({_id: req.body.user_id}, {$push: {car_ids: car._id}}, function(err, post){
        if(err) return next(err)
        res.status(204).end();
    });
  })
});

// PUT /cars/:id    -- create or update
// body:{"plate_number" : "沪K5235", "model" : "Audi Q5"}
router.put('/:id', function(req, res, next){
    console.log('update user id:'+JSON.stringify(req.params));
    console.log('req.files:'+JSON.stringify(req.files));
    console.log(req.body);


    schema.Users.findByIdAndUpdate(req.params.id, req.body, function(err, post){
        if(err) return next(err);
        res.status(204).end(); 
    });   
});

module.exports = router;
