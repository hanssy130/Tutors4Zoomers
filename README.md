# Tutors4Zoomers README.md

Welcome!

# Video Chat Implementation
The video chat implementation is built using WebRTC, socket.io. By using getUserMedia() to capture user stream, RTCPeerConnection is then used to set up connection between users to allow data transfer. Note: user need to establish a TURN/STUN server to allow data transfer. We got our server from Twillio's services.

# Chatroom Implementation
The chatroom implementation is built on socket.io library. Socket allows real-time, bi-direction event based data transfer, which allows us to send simple messages to all users in the room.
