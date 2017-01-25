# Directory structure
### db -> Database for restful API
### api -> restful api service written by nodeJS
### nginx -> nginx config file
### server -> Managuage site built with Vue2.0
### docs -> documents
# Projects
1. MongoDB
2. NodeJS (RestFul API)
3. Vuex (Public server)

# Start command
## Using docker way
Following command based on root directory as working directory!
Docker container name: ad_db, ad_api, ad_server, ad_nginx
### MongoDB
    sudo docker run -v "$(pwd)/db/data":/data --name ad_db  -p 8100:27017 -d mongo mongod --smallfiles 
    #execute following command to initial db with test data
    sudo docker exec -it ad_db /data/initdb.sh
### NodeJS
    cd ./api && npm install
    sudo docker run -it -v "$(pwd)/api":/usr/src/app --name ad_api -p 8300:3000 -w /usr/src/app -d --link mongodb:mongo node npm start
### Nginx
    sudo docker run --name nginx -v "$(pwd)/nginx/default.conf":/etc/nginx/conf.d/default.conf -p 8080:80 -p 8443:443 --link nodejs:nodejs  -d nginx

    Then access Restful API with: http://localhost:8080/api/ads

# Tips
## cd api && DEBUG=express* nodemon   ->3000
## cd server && PORT=4000 npm run dev ->4000
## sudo /usr/local/nginx/sbin/nginx -c "$(pwd)/nginx/dev.conf"

##Docker port map:
  Mongodb : 8100 --> 27017
  NodeJS(API): 8300 --> 3000
  Server: 8400 --> 8080
# TODOS

