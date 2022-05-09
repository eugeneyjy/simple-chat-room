const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config();

const { connectToMongoose } = require('./utils/mongo');

// Load mongoose models
const User = require('./api/models/userModel');
const { Conversation, Message } = require('./api/models/conversationModel');

const api = require('./api/routes');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
const port = process.env.PORT || 8000;

app.use(morgan('dev'));
app.use(cookieParser());

app.use(express.json());

app.use('/', api);

// Catch any forwarded next()
app.use('*', function(req, res, next) {
    res.status(404).json({
        error: "Requested resource " + req.originalUrl + " does not exist"
    });
});

// Catch any uncatched error thrown by the endpoints
app.use('*', function(err, req, res, next) {
    console.error("== Error:", err)
    res.status(500).json({
        err: "Server error.  Please try again later."
    });
});

let users = [];

function addUser(userId, socketId) {
    if(!users.some((user) => user.userId === userId)) {
        users.push({ userId, socketId })
    }
}

function removeUser(socketId) {
    users = users.filter((user) => user.socketId !== socketId);
}

function getUser(userId) {
    console.log(users);
    return users.find((user) => user.userId === userId);
}

io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
    });

    socket.on("sendPrivateMessage", ({_id, senderId, receiverId, text, timeStamp}) => {
        const receiver = getUser(receiverId);
        console.log("==receiverId", receiverId);
        console.log("==receiver", receiver);
        console.log("==msgId", _id);
        console.log("==senderId", senderId);
        if(receiver) {
            io.to(receiver.socketId).emit("getPrivateMessage", {
                _id,
                senderId,
                text,
                timeStamp
            });
        }
    });

    socket.on("disconnect", () =>{
        console.log("A user disconnected");
        removeUser(socket.id);
    });
});

http.listen(port, function() {
    connectToMongoose();
    console.log("== Server is running on port", port);
});