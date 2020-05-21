socket.on("connect", () => {
    socket.emit("addUser", prompt("Hello! What is your name?"));
});

socket.on("updateChat", (username, data) => {
    $("#conversation").append("<b>" + username + "</b>" + data + "</br>");
})

socket.on("updateStatus", (userList) => {
    let onlineStatus = $("#onlineUser");
    document.getElementById("onlineUser").innerHTML = "";
    for(let i = 0; i < userList.length; i++) {
        onlineStatus.append("<b>" + userList[i] + "</b></br>");
    }
})

socket.on("connectVideo", (userList) => {
    'use strict';

    let isChannelReady = false;
    let isInitiator = false;
    let isStarted = false;
    let localStream;
    let pc;
    let remoteStream;
    let turnReady;

    let pcConfig = {
        'iceServers': [{
            'urls': 'stun:stun.l.google.com:19302'
        }]
    };

// Set up audio and video regardless of what devices are present.
    let sdpConstraints = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
    };

/////////////////////////////////////////////

    let room = 'foo';
// Could prompt for room name:
// room = prompt('Enter room name:');

    if (room !== '') {
        socket.emit('create or join', room);
        console.log('Attempted to create or  join room', room);
    }

    socket.on('created', function(room) {
        console.log('Created room ' + room);
        isInitiator = true;
    });

    socket.on('full', function(room) {
        console.log('Room ' + room + ' is full');
    });

    socket.on('join', function (room){
        console.log('Another peer made a request to join room ' + room);
        console.log('This peer is the initiator of room ' + room + '!');
        isChannelReady = true;
    });

    socket.on('joined', function(room) {
        console.log('joined: ' + room);
        isChannelReady = true;
    });

    socket.on('log', function(array) {
        console.log.apply(console, array);
    });

////////////////////////////////////////////////

    function sendMessage(message) {
        console.log('Client sending message: ', message);
        socket.emit('message', message);
    }

// This client receives a message
    socket.on('message', function(message) {
        console.log('Client received message:', message);
        if (message === 'got user media') {
            maybeStart();
        } else if (message.type === 'offer') {
            if (!isInitiator && !isStarted) {
                maybeStart();
            }
            pc.setRemoteDescription(new RTCSessionDescription(message));
            doAnswer();
        } else if (message.type === 'answer' && isStarted) {
            pc.setRemoteDescription(new RTCSessionDescription(message));
        } else if (message.type === 'candidate' && isStarted) {
            let candidate = new RTCIceCandidate({
                sdpMLineIndex: message.label,
                candidate: message.candidate
            });
            pc.addIceCandidate(candidate);
        } else if (message === 'bye' && isStarted) {
            handleRemoteHangup();
        }
    });

////////////////////////////////////////////////////

    let localVideo = document.getElementById("localVideo");
    let remoteVideo = document.getElementById("remoteVideo");

    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
        .then(gotStream)
        .catch(function(e) {
            alert('getUserMedia() error: ' + e.name);
        });

    function gotStream(stream) {
        console.log('Adding local stream.');
        localStream = stream;
        localVideo.srcObject = stream;
        sendMessage('got user media');
        if (isInitiator) {
            maybeStart();
        }
    }

    let constraints = {
        video: true
    };

    console.log('Getting user media with constraints', constraints);

    // if (location.hostname !== 'localhost') {
    //     requestTurn(
    //         'https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913'
    //     );
    // }

    function maybeStart() {
        console.log('>>>>>>> maybeStart() ', isStarted, localStream, isChannelReady);
        if (!isStarted && typeof localStream !== 'undefined' && isChannelReady) {
            console.log('>>>>>> creating peer connection');
            createPeerConnection();
            pc.addStream(localStream);
            isStarted = true;
            console.log('isInitiator', isInitiator);
            if (isInitiator) {
                doCall();
            }
        }
    }

    window.onbeforeunload = function() {
        sendMessage('bye');
    };

/////////////////////////////////////////////////////////

    function createPeerConnection() {
        try {
            let restartConfig = { iceServers: [{"url":"stun:global.stun.twilio.com:3478?transport=udp","urls":"stun:global.stun.twilio.com:3478?transport=udp"},{"url":"turn:global.turn.twilio.com:3478?transport=udp","username":"abf02c35e539434012b71e2ace210512ae18c614876359567bcde0ef43faf8d5","urls":"turn:global.turn.twilio.com:3478?transport=udp","credential":"2uAYY3xLH0Uj+CNn2580pVDfNZQssSUwKHwh0QPaKaM="},{"url":"turn:global.turn.twilio.com:3478?transport=tcp","username":"abf02c35e539434012b71e2ace210512ae18c614876359567bcde0ef43faf8d5","urls":"turn:global.turn.twilio.com:3478?transport=tcp","credential":"2uAYY3xLH0Uj+CNn2580pVDfNZQssSUwKHwh0QPaKaM="},{"url":"turn:global.turn.twilio.com:443?transport=tcp","username":"abf02c35e539434012b71e2ace210512ae18c614876359567bcde0ef43faf8d5","urls":"turn:global.turn.twilio.com:443?transport=tcp","credential":"2uAYY3xLH0Uj+CNn2580pVDfNZQssSUwKHwh0QPaKaM="}]
            };
            pc = new RTCPeerConnection(restartConfig);
            pc.onicecandidate = handleIceCandidate;
            pc.onaddstream = handleRemoteStreamAdded;
            pc.onremovestream = handleRemoteStreamRemoved;
            console.log('Created RTCPeerConnection');
        } catch (e) {
            console.log('Failed to create PeerConnection, exception: ' + e.message);
            alert('Cannot create RTCPeerConnection object.');
            return;
        }
    }

    function handleIceCandidate(event) {
        console.log('icecandidate event: ', event);
        if (event.candidate) {
            sendMessage({
                type: 'candidate',
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate
            });
        } else {
            console.log('End of candidates.');
        }
    }

    function handleCreateOfferError(event) {
        console.log('createOffer() error: ', event);
    }

    function doCall() {
        console.log('Sending offer to peer');
        pc.createOffer(setLocalAndSendMessage, handleCreateOfferError);
    }

    function doAnswer() {
        console.log('Sending answer to peer.');
        pc.createAnswer().then(
            setLocalAndSendMessage,
            onCreateSessionDescriptionError
        );
    }

    function setLocalAndSendMessage(sessionDescription) {
        pc.setLocalDescription(sessionDescription);
        console.log('setLocalAndSendMessage sending message', sessionDescription);
        sendMessage(sessionDescription);
    }

    function onCreateSessionDescriptionError(error) {
        trace('Failed to create session description: ' + error.toString());
    }

    function requestTurn(turnURL) {
        let turnExists = false;
        for (let i in pcConfig.iceServers) {
            if (pcConfig.iceServers[i].urls.substr(0, 5) === 'turn:') {
                turnExists = true;
                turnReady = true;
                break;
            }
        }
        if (!turnExists) {
            console.log('Getting TURN server from ', turnURL);
            // No TURN server. Get one from computeengineondemand.appspot.com:
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let turnServer = JSON.parse(xhr.responseText);
                    console.log('Got TURN server: ', turnServer);
                    pcConfig.iceServers.push({
                        'urls': 'turn:' + turnServer.username + '@' + turnServer.turn,
                        'credential': turnServer.password
                    });
                    turnReady = true;
                }
            };
            xhr.open('GET', turnURL, true);
            xhr.send();
        }
    }

    function handleRemoteStreamAdded(event) {
        console.log('Remote stream added.');
        remoteStream = event.stream;
        remoteVideo.srcObject = remoteStream;
    }

    function handleRemoteStreamRemoved(event) {
        console.log('Remote stream removed. Event: ', event);
    }

    function hangup() {
        console.log('Hanging up.');
        stop();
        sendMessage('bye');
    }

    function handleRemoteHangup() {
        console.log('Session terminated.');
        stop();
        isInitiator = false;
    }

    function stop() {
        isStarted = false;
        pc.close();
        pc = null;
    }
    // }
})

// socket.on("updateVideo", (userList) => {
//     document.getElementById("videoContainer").innerHTML = "";
//     for(let i = 0; i < userList.length; i++) {
//         let videoId = "localVideo" + userList[i];
//         $("#videoContainer").append("<video id=" + videoId + " autoplay playsinline></video>")
//     }
// })

$(() => {
    $("#sendMsg").click(() => {
        let msg = $("#msg").val();
        $("#msg").val("");
        socket.emit("sendChat", msg);
    })
})