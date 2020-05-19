socket = io.connect('http://localhost:3000/');
// put new room into room list menu
socket.on('room-created', room => {
    const roomElement = document.createElement('div');
    roomElement.innerText = room;
    const roomLink = document.createElement('a');
    roomLink.href = `/${room}`;
    roomLink.innerText = 'join';
    roomContainer.append(roomElement);
    roomContainer.append(roomLink);
});