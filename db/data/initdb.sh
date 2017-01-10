#!/bin/bash

mongo cwang --eval "db.dropDatabase()"
mongoimport -d cwang -c users --file /data/schemas/users.json
mongoimport -d cwang -c ads --file /data/schemas/ads.json
mongoimport -d cwang -c cars --file /data/schemas/cars.json
