
let socket;
let lineArray;
let canvas;
let currentColour = 'black';
let currentWeight = 5;
let linesLength = [];
let lineCount = 0;
let lines = [];
let imgURl;
const roomContainer = document.getElementById('message-container');
function setup() {
    canvas = createCanvas(400, 400);
    canvas.id("wb");
    lineArray = [];
    socket = io.connect('http://localhost:3000/');
    socket.on('line', newLines);
    socket.on('colour',  updateColour);
    socket.on('clear', clearCanvas);
    socket.on('lineLengths',  updateLinesLength);
    socket.on('lineArray',  updateLineArray);
    socket.on('delete',  deleteNewest);
    socket.on('weight',  updateWeightLocal);
    socket.on('updateImg',  updateImgOnline);
    // sends a new user message and the room name
    socket.emit('new-user', roomName);
}

function updateWeightLocal(data) {
    currentWeight = data;
}
function updateLinesLength(data) {
    linesLength = data;
    console.log("update lines length")
}

function updateLineArray(data) {
    lineArray = data;
}

function deleteNewest(){
    clearCanvas('cleared');
    reDrawCanvas();
}

function newLines(data){
    // makes a line on a a screen based off received data.
    let line = new LineObject(data.x,data.y,data.px,data.py,data.weight);
    if(line){
        console.log("got line from the web!");
    }
}


function updateColour(data) {
    currentColour = data;
}

function clearCanvas(data) {
    console.log(data);
    canvas.clear();
}

function draw()
{
}

function LineObject(x,y,px,py,weight){
    // makes a line
    let lineOutput = line(x,y,px,py);
    stroke(currentColour);
    strokeWeight(weight);
    return lineOutput;
}

function sendMouseData() {
    let coord = {
        x: mouseX,
        y: mouseY,
        px: pmouseX,
        py: pmouseY,
        color: currentColour,
        weight: currentWeight
    };
    // push coords into line array
    lines.push(coord);
    // sends the coords to the big array of lines
    if(lines.length > 0) {
        lineArray.push(coord);
    }
    //console.log(coord);
    // send the coords to other users
    socket.emit('line',roomName, coord);
}

function mousePressed() {
    LineObject(mouseX, mouseY, mouseX, mouseY, currentWeight);
    stroke(currentColour);
    sendMouseData();
}
function mouseDragged() {
    // uses the current coords of the mouse and previous coords to make a line
    LineObject(mouseX, mouseY, pmouseX, pmouseY, currentWeight);
    stroke(currentColour);

    sendMouseData();
}

function mouseReleased(){
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
    if (linesLength.length === 0){
        return;
    }
    // how many points to delete
    let numberOfPoints = linesLength.pop();
    console.log("length of line remove:" + numberOfPoints);
    // removes the amount of points specified
    let oldLength = lineArray.length;
    lineArray.length = (oldLength - numberOfPoints);

    // redraws all the lines in the scene that were not deleted
    for (let index = 0; index < lineArray.length; index++) {
        let data = lineArray[index];
        LineObject(data.x, data.y, data.px,data.py, data.weight);
        stroke(data.color);
    }

        let myCanvas = document.getElementById("wb");
        // myCanvas.style.background = "url('https://www.enchantedlearning.com/generate/thumbnails/multiply-1-1-6.gif')";
        // myCanvas.style.backgroundSize = "100% 100%";
        myCanvas.style.backgroundColor = "white";
}


function keyPressed() {
    // remove all elements from the canvas
    if (key === 'e') {
        clearCanvas();
        socket.emit('clear',roomName, 'clear');
    }
    if(key === 'c') {
        for (let x = 0; x < lineArray.length; x++) {
            console.log('line: ' + x);
        }
    }

    if (key === 'z') {
        socket.emit('lineLengths', linesLength);
        socket.emit('lineArray', lineArray);
        socket.emit('delete');
        console.log("SENT DELETE");
        deleteNewest()
    }
}

//change to red
document.getElementById("red").addEventListener("click", function(){
    console.log("red");
    currentColour = 'red';
    socket.emit('colour',roomName, currentColour);
});

//change to yellow
document.getElementById("yellow").addEventListener("click", function(){
    currentColour = 'yellow';
    socket.emit('colour',roomName, currentColour);
});

//change to yellow
document.getElementById("black").addEventListener("click", function(){
    currentColour = 'black';
    socket.emit('colour',roomName, currentColour);
});

//change to eraser
document.getElementById("eraser").addEventListener("click", function(){
    currentColour = 'white';

    socket.emit('colour',roomName, currentColour);
});

// change stroke weight
document.getElementById("small").addEventListener("click", function(){
    currentWeight = 3;
    socket.emit('weight',roomName, currentWeight);
});

document.getElementById("regular").addEventListener("click", function(){
    currentWeight = 5;
    socket.emit('weight',roomName, currentWeight);
});

document.getElementById("large").addEventListener("click", function(){
    currentWeight = 7;
    socket.emit('weight',roomName, currentWeight);
});

function updateImg(data) {
        let names = document.getElementById('fileUp');
        console.log(names.files.item(0).name);
        let url = names.files.item(0).name;
        let img = "http://localhost:3000/images/" + url;
        console.log(img);
        let myCanvas = document.getElementById("wb");
        imgURl = 'https://www.enchantedlearning.com/generate/thumbnails/multiply-1-1-6.gif';
        myCanvas.style.background = "url('https://www.enchantedlearning.com/generate/thumbnails/multiply-1-1-6.gif')";
        myCanvas.style.backgroundSize = "100% 100%";
        // let image = loadImage('https://d1i4t8bqe7zgj6.cloudfront.net/09-28-2016/t_1475094050758_name_pepe.jpg');
        // //canvas.drawingContext.globalCompositeOperation = 'destination-over';
        // background(image);
        console.log("bruh it worked?!");
}

function updateImgOnline(){
    let myCanvas = document.getElementById("wb");
    imgURl = 'https://www.enchantedlearning.com/generate/thumbnails/multiply-1-1-6.gif';
    myCanvas.style.background = "url('https://www.enchantedlearning.com/generate/thumbnails/multiply-1-1-6.gif')";
    myCanvas.style.backgroundSize = "100% 100%";
    // let image = loadImage('https://d1i4t8bqe7zgj6.cloudfront.net/09-28-2016/t_1475094050758_name_pepe.jpg');
    // //canvas.drawingContext.globalCompositeOperation = 'destination-over';
    // background(image);
    console.log("bruh it worked?! ONLINE");
}
