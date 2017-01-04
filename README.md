# Projects
1. MongoDB
2. NodeJS (RestFul API)
3. Nginx (Public server)

## Start command
..* MongoDB
    sudo docker run -v "$(pwd)/data":/data --name mongodb -d mongo mongod --smallfiles 
..* NodeJS
    sudo docker run -it -v "$(pwd)/../app":/usr/src/app --name cwang_node_test -p 8300:3000 -w /usr/src/app -d --link mongodb:mongo node npm start
..* Nginx

## Tips
..* 
## DEBUG=express* nodemon 
