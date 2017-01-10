
var mongoose = require('mongoose');

var AdSchema = new mongoose.Schema({
    company: String,
    car_type: Number,
    car_total: Number
    start_date: {type: Date,default: Date.now},
    end_date: {type: Date, default: Date.now},
    logo: String,
    model: String
});
var UserSchema = new mongoose.Schema({
    role: String,
    username: String,
    passwd: String,
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

module.exports = {
        Ads: mongoose.model('Ads',AdSchema),
        Users: mongoose.model("Users", UserSchema),
        Cars: mongoose.model('Cars', CarSchema)
}


