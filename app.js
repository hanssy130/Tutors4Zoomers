const express = require("express");

let app = express();
    app.use(express.urlencoded({extended: true}));
    app.use(express.static("public"));
    app.set("view engine", "ejs");

const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = 3000;

let roomName = [];

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

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});