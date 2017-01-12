#!/bin/bash
curl -X POST -F company=Volkswagen -F car_type=1 -F car_total=200 -F start_date=2016-11-01 -F end_date=2017-11-01 -F 'logo=@images/logo1.png' -F 'model=@images/model1.jpg' http://localhost:3000/api/ads

curl -X POST -F company=Star -F car_type=1 -F car_total=200 -F start_date=2016-11-01 -F end_date=2017-11-01 -F 'logo=@images/logo2.png' -F 'model=@images/model2.jpg' http://localhost:3000/api/ads
