#!/bin/bash

DBPORT_O=8100 #port in host
DBPORT_I=27017 #port in container
APIPORT_O=8300
APIPORT_I=3000
SERVERPORT_O=8400
SERVERPORT_I=8080
NGINXPORT_O=80
NGINXPORT_I=80
DOCKER_NET=my_net
CONTAINER_DB=ad_db
CONTAINER_API=ad_api
CONTAINER_SERVER=ad_server
CONTAINER_NGINX=ad_nginx

ACTION=start

usage(){
		echo "Usage:"
		echo "   `basename $0` {start|stop}"
		exit 1
}
parse_args(){
    case "$1" in
		start)
			ACTION=start
			;;	
		stop)
			ACTION=stop
			;;
		*)
			echo "Error: Wrong parameters: $1"
			usage
			;;
	esac
}

start(){
	echo "Create docker network..."
	docker network create -d bridge $DOCKER_NET
	
	echo "Start Mongo DB..."
	# start MongoDB image
	docker run -v "$(pwd)/db/data":/data --rm --name $CONTAINER_DB --network $DOCKER_NET -p $DBPORT_O:$DBPORT_I -d mongo mongod --smallfiles 

	#initial mongodb with test data
	docker exec -it ad_db /data/initdb.sh

	echo "Start Restful API server ..."
	# start API server (nodejs)
	#Legacy cross access with '--link' option
	#sudo docker run -it -v "$(pwd)/api":/usr/src/app --name ad_api -p $APIPORT_O:$APIPORT_I -w /usr/src/app -d --link ad_db:mongo node npm start
	
	#offical start API command
	#docker run -it -v "$(pwd)/api":/usr/src/app --name $CONTAINER_API --network $DOCKER_NET -p $APIPORT_O:$APIPORT_I -w /usr/src/app -d node npm start	
	
	#Turn off auth with '-e AUTH=false'
	docker run -it -v "$(pwd)/api":/usr/src/app --name $CONTAINER_API --network $DOCKER_NET -p $APIPORT_O:$APIPORT_I -w /usr/src/app -e AUTH=false -d node npm start

	echo "Start management server ..."
	# start management server (Vue2)
	docker run -it -v "$(pwd)/server":/usr/src/app --name $CONTAINER_SERVER --network $DOCKER_NET -p $SERVERPORT_O:$SERVERPORT_I -w /usr/src/app -d node npm run dev
	
	echo "Start nginx server ..."
	# start Nginx to proxy up 3 servers
	#sudo /usr/local/nginx/sbin/nginx -c "$(pwd)/nginx/nginx.conf"
	docker run -it -v "$(pwd)/nginx/nginx-docker.conf":/etc/nginx/nginx.conf --name $CONTAINER_NGINX --network $DOCKER_NET -p $NGINXPORT_O:$NGINXPORT_I -d nginx nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
	#docker run -it -v "$(pwd)/nginx/nginx-docker.conf":/etc/nginx/nginx.conf --name ad_nginx --network my_net -p 80:80 -d nginx nginx -c /etc/nginx/nginx.conf
	
	echo "Now you can access site with: http://localhost:$NGINXPORT_O"
}

stop(){
	echo "Remove containers..."
	docker container stop $CONTAINER_NGINX $CONTAINER_SERVER $CONTAINER_API $CONTAINER_DB
	docker container rm $CONTAINER_NGINX $CONTAINER_SERVER $CONTAINER_API $CONTAINER_DB
	
	echo "Remove docker network..."
	docker network rm $DOCKER_NET
}

parse_args $1

case $ACTION in
	start)
		start
		;;
	stop)
		stop
		;;
	*)
		usage
		;;
esac