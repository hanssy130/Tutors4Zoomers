// socket = io.connect("http://localhost:3001/");
socket = io.connect(window.location.hostname);
// put new room into room list menu
socket.on("room-created", (room) => {
  const roomElement = document.createElement("div");
  roomElement.innerText = room;
  const roomLink = document.createElement("a");
  roomLink.href = `/session/${room}`;
  roomLink.innerText = "Join";
  roomContainer.append(roomElement);
  roomContainer.append(roomLink);
});
