
var mongoose = require('mongoose')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')

var AdSchema = new mongoose.Schema({
    company: String,
    car_type: Number,
    car_total: Number,
    start_date: {type: Date,default: Date.now},
    end_date: {type: Date, default: Date.now},
    logo: String,
    model: String
});
var UserSchema = new mongoose.Schema({
    role: String,
    username: String,
    passwd: String,
    hash: String,
    salt: String,
    basic_info: {
        name: String,
        sex: Number,
        city: String,
        address: String,
        phone: String,
        email: String,
        head_icon: String
    },
    cert_info: {
        identity: String,
        id_image: String
    },
    car_ids: [mongoose.Schema.Types.ObjectId]
});
var CarSchema = new mongoose.Schema({
    plate_number: String,
    model: String,
    ads: [{
            ad_id: mongoose.Schema.Types.ObjectId,
            state: Number,
            position: Number
        }]
});

////////////// authentication methods //////////////////
UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex')
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex')
}

UserSchema.methods.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha512').toString('hex')
    console.log('computed hash:' + hash)
    console.log('password hash:' + this.hash)
    return this.hash === hash
}

UserSchema.methods.generateJwt = function () {
    var expiry = new Date()
    expiry.setDate(expiry.getDate() + 7)
    return jwt.sign({
        _id: this._id,
        name: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, "SECRET_CWANG")
}
//////////////////////end ////////////////////////////////
module.exports = {
        Ads: mongoose.model('Ads',AdSchema),
        Users: mongoose.model("Users", UserSchema),
        Cars: mongoose.model('Cars', CarSchema)
}


