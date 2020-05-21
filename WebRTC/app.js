const express = require("express");

let app = express();
    app.use(express.urlencoded({extended: true}));
    app.use(express.static("public"));
    app.set("view engine", "ejs");

const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 3000;

let roomName = [];
let user = [];

app.get("/", (req, res) => res.render("pages/chatroom.ejs"));
app.get("/chatroomForm", (req, res) => {
    res.render("pages/chatroomForm");
});

app.post("/chatroomForm", (req, res) => {
    let formData = req.body;
    console.log(formData);
    roomName.push(formData["roomName"]);
    console.log(roomName)
    res.render("pages/chatroomMenu", {room: roomName})
})

app.get("/chatroom", (req, res) => {
    res.render("pages/chatroom.ejs")
})

io.on("connection", (socket) => {
    socket.on("addUser", (username) => {
        console.log(username);
        socket.username = username;
        user.push(username);
        io.emit("updateChat", socket.username, " has joined")
        io.emit("updateStatus", user)
        socket.emit("updateLocalVideo", socket.username, user);
        io.emit("updateRemoteVideo", user)
        io.emit("connectVideo", user)
        // console.log(user);
    })
    socket.on("sendChat", (msg) => {
        console.log(msg)
        io.emit("updateChat", socket.username, ": " + msg)
    })
    socket.on("disconnect", ()=> {
        let index = user.indexOf(socket.username)
        user.splice(index, 1);
        io.emit("updateStatus", user)
    })

    // convenience function to log server messages on the client
    function log() {
        var array = ['Message from server:'];
        array.push.apply(array, arguments);
        socket.emit('log', array);
    }

    socket.on('message', function(message) {
        log('Client said: ', message);
        // for a real app, would be room-only (not broadcast)
        socket.broadcast.emit('message', message);
    });

    socket.on('create or join', function(room) {
        log('Received request to create or join room ' + room);

        var clientsInRoom = io.sockets.adapter.rooms[room];
        var numClients = clientsInRoom ? Object.keys(clientsInRoom.sockets).length : 0;
        log('Room ' + room + ' now has ' + numClients + ' client(s)');

        if (numClients === 0) {
            socket.join(room);
            log('Client ID ' + socket.id + ' created room ' + room);
            socket.emit('created', room, socket.id);

        } else if (numClients === 1) {
            log('Client ID ' + socket.id + ' joined room ' + room);
            io.sockets.in(room).emit('join', room);
            socket.join(room);
            socket.emit('joined', room, socket.id);
            io.sockets.in(room).emit('ready');
        } else { // max two clients
            socket.emit('full', room);
        }
    });

    socket.on('ipaddr', function() {
        var ifaces = os.networkInterfaces();
        for (var dev in ifaces) {
            ifaces[dev].forEach(function(details) {
                if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
                    socket.emit('ipaddr', details.address);
                }
            });
        }
    });

    socket.on('bye', function(){
        console.log('received bye');
    });
})


http.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});