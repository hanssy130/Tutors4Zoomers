let socket;
let lineArray;
let canvas;
let currentColour = "black";
let currentWeight = 5;
let linesLength = [];
let lineCount = 0;
let lines = [];
function setup() {
  canvas = createCanvas(400, 400);
  canvas.id("myCanvas");
  // set background to white
  background(400);
  lineArray = [];

  // CHOOSE ONE - connect locally vs Heroku
  // socket = io.connect("http://localhost:3001/");
  socket = io.connect(window.location.hostname);

  socket.on("line", newLines);
  socket.on("colour", updateColour);
  socket.on("clear", clearCanvas);
  socket.on("lineLengths", updateLinesLength);
  socket.on("lineArray", updateLineArray);
  socket.on("delete", deleteNewest);
  socket.on("weight", updateWeightLocal);
  // sends a new user message and the room name
  // For JUSTIN to review.
  // socket.emit("new-user", roomName);
}

function updateWeightLocal(data) {
  currentWeight = data;
}

function updateLinesLength(data) {
  linesLength = data;
  console.log("update lines length");
}

function updateLineArray(data) {
  lineArray = data;
}

function deleteNewest() {
  clearCanvas("cleared");
  reDrawCanvas();
}

function newLines(data) {
  // makes a line on a a screen based off received data.
  let line = new LineObject(data.x, data.y, data.px, data.py, data.weight);
  if (line) {
    console.log("got line from the web!");
  }
}

function updateColour(data) {
  currentColour = data;
}

function clearCanvas(data) {
  console.log(data);
  canvas.clear();
  background(51);
}

function draw() {}

function LineObject(x, y, px, py, weight) {
  // makes a line
  let lineOutput = line(x, y, px, py);
  stroke(currentColour);
  strokeWeight(weight);
  return lineOutput;
}

function mouseDragged() {
  // uses the current coords of the mouse and previous coords to make a line
  LineObject(mouseX, mouseY, pmouseX, pmouseY, currentWeight);
  stroke(currentColour);

  // a data structure to send data to other computers
  let coord = {
    x: mouseX,
    y: mouseY,
    px: pmouseX,
    py: pmouseY,
    color: currentColour,
    weight: currentWeight,
  };
  // push coords into line array
  lines.push(coord);
  // sends the coords to the big array of lines
  if (lines.length > 0) {
    lineArray.push(coord);
  }
  //console.log(coord);
  // send the coords to other users
  socket.emit("line", coord);
}

function mouseReleased() {
  // sends the line length to array
  if (lines.length > 0) {
    linesLength.push(lines.length);
    lineCount++;
  }
  console.log("line count:" + lineCount);
  console.log("line length:" + lines.length);
  lines.length = 0;
}

function reDrawCanvas() {
  if (linesLength.length === 0) {
    return;
  }
  // how many points to delete
  let numberOfPoints = linesLength.pop();
  console.log("length of line remove:" + numberOfPoints);
  // removes the amount of points specified
  let oldLength = lineArray.length;
  lineArray.length = oldLength - numberOfPoints;

  // redraws all the lines in the scene that were not deleted
  for (let index = 0; index < lineArray.length; index++) {
    let data = lineArray[index];
    LineObject(data.x, data.y, data.px, data.py, data.weight);
    stroke(data.color);
  }
}

function keyPressed() {
  // remove all elements from the canvas
  if (key === "e") {
    clearCanvas();
    socket.emit("clear", roomName, "clear");
  }
  if (key === "c") {
    for (let x = 0; x < lineArray.length; x++) {
      console.log("line: " + x);
    }
  }

  if (key === "z") {
    socket.emit("lineLengths", linesLength);
    socket.emit("lineArray", lineArray);
    socket.emit("delete");
    console.log("SENT DELETE");
    deleteNewest();
  }
}

//change to red
document.getElementById("red").addEventListener("click", function () {
  console.log("red");
  currentColour = "red";
  socket.emit("colour", roomName, currentColour);
});

//change to yellow
document.getElementById("yellow").addEventListener("click", function () {
  currentColour = "yellow";
  socket.emit("colour", roomName, currentColour);
});

//change to yellow
document.getElementById("black").addEventListener("click", function () {
  currentColour = "black";
  socket.emit("colour", roomName, currentColour);
});

//change to eraser
document.getElementById("eraser").addEventListener("click", function () {
  currentColour = "white";

  socket.emit("colour", roomName, currentColour);
});

// change stroke weight
document.getElementById("small").addEventListener("click", function () {
  currentWeight = 3;
  socket.emit("weight", roomName, currentWeight);
});

document.getElementById("regular").addEventListener("click", function () {
  currentWeight = 5;
  socket.emit("weight", roomName, currentWeight);
});

document.getElementById("large").addEventListener("click", function () {
  currentWeight = 7;
  socket.emit("weight", roomName, currentWeight);
});
