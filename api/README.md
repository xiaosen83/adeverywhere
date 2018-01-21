# Debug API server
$ DEBUG=express* nodemon 

#default port is 3000 (./bin/www)
#PORT=8080 npm run start

## upload file to API server
$ curl -X POST -F company=emc -F 'model=@/tmp/model.jpg' -F 'logo=@/tmp/logo.png' http://localhost:3000/api/ads
