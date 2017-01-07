
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/cwang')
    .then(() => console.log('mongodb connect succesful'))
    .catch((err) => console.err(err));
   
var AdSchema = new mongoose.Schema({
    company: String,
    car_type: Number,
    car_total: Number,
    car_current: Number,
    start_date: {type: Date,default: Date.now},
    end_date: {type: Date, default: Date.now}
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

var schemas = {
        Ads: mongoose.model('Ads',AdSchema),
        Users: mongoose.model("Users", UserSchema),
        Cars: mongoose.model('Cars', CarSchema)
}

var ad = new schemas.Ads({company:'Apple', car_type: 1, car_total: 500, car_current: 300});

ad.save(function(err){
    if(err) console.log(err);
    console.log(ad);
});



