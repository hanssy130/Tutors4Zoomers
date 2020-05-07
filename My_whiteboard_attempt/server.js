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
    socket.on('colour', colourUpdate);
    socket.on('clear', clearCanvas);
    socket.on('lineLengths', updateLinesLength);
    socket.on('lineArray', updateLineArray);
    socket.on('delete', tester);

    function tester(){
        socket.broadcast.emit('delete');
    }

    function updateLinesLength(data) {
        // send data back out to others
        socket.broadcast.emit('lineLengths', data);
    }

    function updateLineArray(data) {
        // send data back out to others
        socket.broadcast.emit('lineArray', data);
    }

    function mouseMsg(data) {
        // send data back out to others
        socket.broadcast.emit('mouse',data);
        console.log(data);
    }

    function lineMsg(data) {
        // send data back out to others
        socket.broadcast.emit('line',data);
    }

    function colourUpdate(data) {
        // send data back out to others
        socket.broadcast.emit('colour', data);
    }

    function clearCanvas(data) {
        // send data back out to others
        socket.broadcast.emit('clear',data);
    }
}