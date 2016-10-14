var express = require('express');
var router = express.Router();
var path = require('path');
var bodyParser = require('body-parser');
var multer = require('multer');

/* GET home page. */
router.get('/', function(req, res, next) {
  //console.log(path.join(__dirname, '../', 'views', 'index.pug'));
  res.render('index', { title: 'Express' });
  //res.sendFile(path.join(__dirname, '../', 'views', 'index.pug'));
});

router.get('/main', function(req, res, next) {
  res.render('main', { title: 'Express' });
});

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
/** API path that will upload the files */
var cpUpload = upload.fields([{ name: 'model', maxCount: 1 }, { name: 'logo', maxCount: 1 }])
router.post('/newad', cpUpload, function(req, res) {
    console.log(req.files);
    console.log(req.body);
    res.status(204).end();
});

module.exports = router;
