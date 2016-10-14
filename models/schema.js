
var mongoose = require('mongoose');

var AdSchema = new mongoose.Schema({
    company: String,
    car_type: Number,
    car_total: Number,
    car_current: Number,
    start_date: {type: Date,default: Date.now},
    end_date: {type: Date, default: Date.now},
    logo: String,
    model: String
});
var UserSchema = new mongoose.Schema({
    name: String,
    nick_name: String,
    identity: String,
    car_id: mongoose.Schema.Types.ObjectId,
});
var CarSchema = new mongoose.Schema({
    user_id: mongoose.Schema.Types.ObjectId,
    plate_number: String,
    my_ads: [{ads: {
                ad_id: mongoose.Schema.Types.ObjectId,
                state: Number
            }}]
});

module.exports = {
        Ads: mongoose.model('Ads',AdSchema),
        Users: mongoose.model("Users", UserSchema),
        Cars: mongoose.model('Cars', CarSchema)
}


