// require the library
let express = require('express');
// make the function
let app = express();
// listen on port 3000
let server = app.listen(3000);
// app should host in the directory 'public'
app.use(express.static('public'));
console.log("server is running");
let socket = require('socket.io');

// io will store messages from/to server.js
let io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket) {
    console.log('new connection: ' + socket.id);

    socket.on('mouse', mouseMsg);
    socket.on('line', lineMsg);
    function mouseMsg(data) {
        // send data back out to others
        socket.broadcast.emit('mouse',data);
        console.log(data);
    }

    function lineMsg(data) {
        socket.broadcast.emit('line',data);
    }
}