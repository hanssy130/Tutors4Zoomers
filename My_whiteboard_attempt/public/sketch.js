// let socket;
// let points;
// let lines;
// function setup() {
//     let canvas = createCanvas(400, 300);
//     background(51);
//     strokeWeight(6);
//     noFill();
//     // declare the points as an array
//     points = [];
//     lines = [];
//     socket = io.connect('http://localhost:3000/');
//     socket.on('mouse', newDrawing);
// }
//
// function newDrawing(data) {
//     // add the received points to the array
//     points.push(data);
// }
//
// function draw() {
//     beginShape();
//     for(let place in points) {
//         console.log("drawing");
//         // grab the point by index
//         var point = points[place];
//         // draw a line between these points
//         let line = curveVertex(point.x, point.y);
//         lines.push(line);
//     }
//     endShape();
// }
// // save the drawing
// function mouseDragged(){
//     console.log(mouseX + ' ' + mouseY);
//     let point = {
//         x: mouseX,
//         y: mouseY
//     };
//     // send the data named mouse
//     points.push(point);
//     socket.emit('mouse', point);
//     //points = [];
// }

let socket;
let lineArray;
let canvas;
let currentColour = 'black';
let currentWeight = 5;
let linesLength = [];
let lineCount = 0;
let lines = [];
function setup() {
    canvas = createCanvas(400, 400);
    canvas.id('myCanvas');
    // set background to black
    background(51);
    lineArray = [];
    socket = io.connect('http://localhost:3000/');
    socket.on('line', newLines);
    socket.on('colour', updateColour);
    socket.on('clear',clearCanvas);
    socket.on('lineLengths', updateLinesLength);
    socket.on('lineArray', updateLineArray);
    socket.on('delete', deleteNewest);
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
    background(51);
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
    socket.emit('line', coord);
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
}


function keyPressed() {
    // remove all elements from the canvas
    if (key === 'e') {
        clearCanvas();
        socket.emit('clear', 'clear');
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
    socket.emit('colour', currentColour);
});
//change to yellow
document.getElementById("yellow").addEventListener("click", function(){
    currentColour = 'yellow';
    socket.emit('colour', currentColour);
});
//change to eraser
document.getElementById("eraser").addEventListener("click", function(){
    currentColour = 51;
    socket.emit('colour', currentColour);
});