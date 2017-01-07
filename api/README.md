# Projects
1. MongoDB
2. NodeJS (RestFul API)
3. Nginx (Public server)

## Start command
### MongoDB
    sudo docker run -v "$(pwd)/data":/data --name mongodb -d mongo mongod --smallfiles 
### NodeJS
    sudo docker run -it -v "$(pwd)/../app":/usr/src/app --name cwang_node_test -p 8300:3000 -w /usr/src/app -d --link mongodb:mongo node npm start
### Nginx
    sudo docker run --name nginx -v "$(pwd)/nginx/default.conf":/etc/nginx/conf.d/default.conf -p 8080:80 -p 8443:443 --link nodejs:nodejs  -d nginx

    Then access Restful API with: http://localhost:8080/api/ads
## Tips
..* 
## DEBUG=express* nodemon 
