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
    for(let i = 0; i < userList.length; i++) {
        let videoId = "localVideo" + userList[i];

        const mediaStreamConstraints = {
            video: true,
            // audio: true,
        };
        const localVideo = document.getElementById(videoId);
        let localStream;
        function gotLocalMediaStream(mediaStream) {
            localStream = mediaStream;
            localVideo.srcObject = mediaStream;
        }

        function handleLocalMediaStreamError(error) {
            console.log('navigator.getUserMedia error: ', error);
        }

        navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
            .then(gotLocalMediaStream).catch(handleLocalMediaStreamError)

    }
})

socket.on("updateVideo", (userList) => {
    document.getElementById("videoContainer").innerHTML = "";
    for(let i = 0; i < userList.length; i++) {
        let videoId = "localVideo" + userList[i];
        $("#videoContainer").append("<video id=" + videoId + " autoplay playsinline></video>")
    }
})

$(() => {
    $("#sendMsg").click(() => {
        let msg = $("#msg").val();
        $("#msg").val("");
        socket.emit("sendChat", msg);
    })
})