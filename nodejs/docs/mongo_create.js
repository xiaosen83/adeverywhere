
var mongoose = require('mongoose');
console.log("creating db cwang");
mongoose.connect('mongodb://localhost/cwang');
console.log("connected");

var AdSchema = new mongoose.Schema({
    company: String,
    car_type: Number,
    car_total: Number,
    car_current: Number,
    start_date: Date,
    end_date: Date
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

var Ads = mongoose.model('Ads',AdSchema);
var Users = mongoose.model("Users", UserSchema);
var Cars = mongoose.model('Cars', CarSchema);

//cleanup exist collections

