# simple-chat-room
## Frameworks
React.js and Express.js + Socket.io

## Running Backend
Run these docker commands in order to have mongo server running
```
docker network create --driver bridge mongo-net
```

```
docker run -d --name mongo-server --network mongo-net -p "27017:27017" -e "MONGO_INITDB_ROOT_USERNAME=root" -e "MONGO_INITDB_ROOT_PASSWORD=hunter2" mongo:latest
```

```
docker run --rm -it --network mongo-net mongo:latest mongo --host mongo-server --username root --password hunter2 --authenticationDatabase admin
```
Inside mongo-shell, run these command to create database and user
```
use chat-room
```
```
db.createUser({
  user: "jenkinuser",
  pwd: "hunter2",
  roles: [ { role: "readWrite", db: "chat-room" } ]
});
```
Finally, exit mongo-shell or open another terminal and run ```npm install``` then ```npm start``` on the /backend folder

# Running Frontend
Run ```npm install``` then ```npm start``` in /frontend folder
