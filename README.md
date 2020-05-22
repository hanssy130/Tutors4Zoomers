![Tutors4Zoomers Logo](https://github.com/hanssy130/COMP-2800-Team-DTC-13-Tutors4Zoomers/blob/master/public/resources/logo.png)

# 1) Introduction
Tutors4Zoomers is a web application that connects volunteer tutors with students in need of help. During COVID-19, we observed that our communities needed more support for education at home, and that people have become more willing to help others. Our platform connects these two ideas to bring them together.

## 1a) About Us
This app was developed by four students studying [Computer Systems Technology](https://www.bcit.ca/study/programs/5500dipma) at BCIT.

**Members**
* Hans Sy
* George Yang
* David Wang
* Justin Majam

# 2) Features
- Registration & Authentication
- Contacting Tutors
- Creating Tutoring Session Rooms
- Video Chat
- Interactive Whiteboard
- Live Chatroom

## 2a) Registration & Authentication
For our authentication strategy we used a local strategy with passport, the information stored in our database is encrypted by passport. In order to configure our database please contact [georgeyang532@gmail.com](mailto:georgeyang532@gmail.com) and request an invite.

For our database strategy we used mongodb, the information stored is under one user schema.

## 2b) Contacting Tutors
Using Nodemailer, users are able to contact Tutors or Students. Nodemailer accesses the recipient's email address from MongoDB, and sends an email. The recipient is notified of the interest in contact and receives the sender's email address too.

## 2c) Creating Tutoring Session Rooms
Session Rooms are kept track with socket.io.

## 2d) Video Chat
The video chat implementation is built using WebRTC, socket.io. By using getUserMedia() to capture user stream, RTCPeerConnection is then used to set up connection between users to allow data transfer. Note: user need to establish a TURN/STUN server to allow data transfer. We got our server from Twillio's services.

## 2e) Interactive Whiteboard
The whiteboard feature runs on the `p5.js` and Socket.io libraries. `p5.js` handles the generation of a drawing surface, brush thickness, and brush colour. To make sure all members of a room see the same image, Socket.io is used to transmit data like new drawings and current brush colour to all users of the same room.

## 2f) Live Chatroom
The chatroom implementation is built on socket.io library. Socket allows real-time, bi-direction event based data transfer, which allows us to send simple messages to all users in the room.

# 3) Set Up

### Languages:
* HTML
* CSS
* JavaScript
* NodeJS

### IDE
* [Visual Studio Code](https://code.visualstudio.com/)

### Database
* [MongoDB](http://mongodb.com/)
* [Socket.io](https://socket.io/)
* [Bulma.io](https://bulma.io/)
* [Express](https://expressjs.com/)
* [Nodemailer](https://nodemailer.com/about/)
* [Passport](http://www.passportjs.org/docs/)
* [Cloudinary](https://cloudinary.com/)

(Please refer to package.json for dependencies through NodeJS)

## 3a) Repository Organization
`index.js` contains the server code and is responsible for initializing everything.

The `/views` folder holds all of our Express (.ejs) pages. Everything the client will see is there.

The `/public` folder contains JavaScript, CSS, and images used for the website.

`Procfile` is let's Heroku initialize the server through index.js

## 3b) Accounts & Passwords
For access to the Mongo Database and Cloudinary image database, please contact `hsy3@my.bcit.ca`.
```
// Cloudinary config
//======================================
cloudinary.config({
  cloud_name: "dprpcrp7n",
  api_key: "376436784342749",
  api_secret: "9eZqrbd0_77WGybe8zd88sh9LSg",
});
```
```
// Initialize Mongoose
// =========================================
const dbUsername = "gyang";
const dbPassword = "123123123";
mongoose.connect(
  `mongodb+srv://${dbUsername}:${dbPassword}@cluster0-p9khr.mongodb.net/T4Z`,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
);
```

## 3c) Installation Instructions
Ensure you have the following installed in this order:
1. [npm](https://www.npmjs.com/get-npm)
2. [git](https://git-scm.com/downloads)
3. Clone this repository.
4. In the folder, initialize npm by entering `npm init` in Terminal/Command Line.
5. Enter `npm install` and it will automatically detect the dependencies from package.json (e.g. Express, Socket, etc).
6. To run a local server, enter `node index.js`.
***!Warning!*** To use socket.io locally, ensure that the local host port is selected in `/public/sketch.js` and `/public/sessionlist.js`. 
