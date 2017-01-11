#!/bin/bash

# start MongoDB image
sudo docker run -v "$(pwd)/db/data":/data --name ad_db -p 8100:27017 -d mongo mongod --smallfiles 

#initial mongodb with test data
sudo docker exec -it ad_db /data/initdb.sh

# start API server (nodejs)
sudo docker run -it -v "$(pwd)/api":/usr/src/app --name ad_api -p 8300:3000 -w /usr/src/app -d --link ad_db:mongo node npm start

# start management server (Vue2)

# start Nginx to proxy up 3 servers
sudo /usr/local/nginx/sbin/nginx -c "$(pwd)/nginx/nginx.conf"
