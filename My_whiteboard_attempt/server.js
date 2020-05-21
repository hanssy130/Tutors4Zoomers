// require the library
let express = require('express');
// make the function
let app = express();
// listen on port 3000
const server = require("http").Server(app);
let upload = require('express-fileupload');
const io = require('socket.io')(server);
const cloudinary = require('cloudinary').v2;
app.use(upload({
    useTempFiles:  true
}));
console.log("server is running");

// io will store messages from/to server.js
app.set('views', './viewss');
app.set('view engine','ejs');
// app should host in the directory 'public'
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));
// io.sockets.on('connection', newConnection);




// list of rooms
const rooms = {name: {}};

// when the page first renders
app.get('/', (req,res) => {
    console.log(rooms);
    res.render('index', {rooms: rooms});
});

app.post('/room', (req, res) => {
    console.log("added room");
    // if room exists return to room list
    if (rooms[req.body.room] != null) {
        return res.redirect('/');
    }
    // add new room
    rooms[req.body.room] = { users: {}};
    res.redirect(req.body.room);
    console.log("redirected");
    // send message that new room was made
    io.emit('room-created', req.body.room);
});

app.get('/:room', (req, res) => {
    // if rooms doesn't exist return to room list
    if (rooms[req.params.room] == null) {
         return res.redirect('/');
    }
    console.log(req.params.room);
    res.render('room', {roomName : req.params.room})
});

server.listen(3000);


cloudinary.config({
    cloud_name: 'dprpcrp7n',
    api_key: '376436784342749',
    api_secret: '9eZqrbd0_77WGybe8zd88sh9LSg'
});

app.post("/images", function (req, res) {
    let currentSocket = req.body.socketName;
    console.log("SOCKET: " + currentSocket);
    const file = req.files.filename;
    console.log(file);
    cloudinary.uploader.upload(file.tempFilePath).then(result=> {
        console.log("NICE");
        console.log(result.url);
        io.sockets.to(currentSocket).emit('updateImg', result.url);
    }).catch(err=>{
        console.log("unfortunate");
        console.log(err);
    });
    res.status(204).send();
});


io.on('connection', socket => {
    console.log('new connection: ' + socket.id);

    socket.on('mouse', mouseMsg);
    socket.on('line', lineMsg);
    socket.on('colour', colourUpdate);
    socket.on('clear', clearCanvas);
    socket.on('lineLengths', updateLinesLength);
    socket.on('lineArray', updateLineArray);
    socket.on('delete', tester);
    socket.on('weight', updateWeight);


    socket.on('new-user', room => {
        // joins the user to the room
        socket.join(room);
    });

    function tester(room, data){
        // send to specific room
        socket.to(room).broadcast.emit('delete', data);
    }

    function updateLinesLength(room,data) {
        // send data back out to others
        // send to specific room
        socket.to(room).broadcast.emit('lineLengths',  data);
    }

    function updateLineArray(room,data) {
        // send data back out to others
        // send to specific room
        socket.to(room).broadcast.emit('lineArray',  data);
    }

    function mouseMsg(room,data) {
        // send data back out to others
        // send to specific room
        socket.to(room).broadcast.emit('mouse', data);
        console.log(data);
    }

    function lineMsg(room,data) {
        // send data back out to others
        // send to specific room
        socket.to(room).broadcast.emit('line', data);
    }

    function colourUpdate(data) {
        // send data back out to others
        // send to specific room
        socket.to(room).broadcast.emit('colour', data);
    }

    function clearCanvas(data) {
        // send data back out to others
        // send to specific room
        socket.to(room).broadcast.emit('clear', data);
    }

    function updateWeight(data) {
        // send data back out to others
        // send to specific room
        socket.to(room).broadcast.emit('weight', data);
    }


})