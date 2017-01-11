# Debug API server
$ DEBUG=express* nodemon 

## upload file to API server
$ curl -X POST -F company=emc -F 'model=@/tmp/model.jpg' -F 'logo=@/tmp/logo.png' http://localhost:3000/api/ads
