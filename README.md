![Tutors4Zoomers Logo](https://github.com/hanssy130/COMP-2800-Team-DTC-13-Tutors4Zoomers/blob/master/public/resources/logo.png)

# 1) Introduction
Tutors4Zoomers is a web application that connects volunteer tutors with students in need of help. During COVID-19, we observed that our communities needed more support for education at home, and that people have become more willing to help others. Our platform connects these two ideas to bring them together.

**Features:**
- Registration & Authentication
- Contacting Tutors
- Creating Tutoring Session Rooms
- Video Chat
- Interactive Whiteboard
- Live Messaging

# 2) Set Up

| Languages | IDEs | Database | APIs |
|---|---|---|
|HTML|Visual Studio Code|MongoDB|Socket.io|
|CSS| |Mongoose|Bulma.io|
|JavaScript| | |Express|
|NodeJS| | |Nodemailer|
| | | |Passport|
| | | |Cloudinary|

(Refer to package.json for dependencies through NodeJS)

# Video Chat Implementation
The video chat implementation is built using WebRTC, socket.io. By using getUserMedia() to capture user stream, RTCPeerConnection is then used to set up connection between users to allow data transfer. Note: user need to establish a TURN/STUN server to allow data transfer. We got our server from Twillio's services.

# Chatroom Implementation
The chatroom implementation is built on socket.io library. Socket allows real-time, bi-direction event based data transfer, which allows us to send simple messages to all users in the room.
