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
function setup() {
    canvas = createCanvas(400, 400);
    // set background to black
    background(51);
    lineArray = [];
    socket = io.connect('http://localhost:3000/');
    socket.on('line', newLines);
    socket.on('colour', updateColour);
    socket.on('clear',clearCanvas)
}

function newLines(data){
    // makes a line on a a screen based off received data.
    let line = new LineObject(data.x,data.y,data.px,data.py);
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

function LineObject(x,y,px,py){
    // makes a line
    line(x,y,px,py);
    stroke(currentColour);
    strokeWeight(5);
}

let lines = [];
let lineCount = 0;
function mouseDragged() {
    // uses the current coords of the mouse and previous coords to make a line
    let line = new LineObject(mouseX, mouseY, pmouseX, pmouseY);
    stroke(currentColour);
    strokeWeight(5);
    console.log("new line");
    lines.push(line);

    // a data structure to send data to other computers
    let coord = {
        x: mouseX,
        y: mouseY,
        px: pmouseX,
        py: pmouseY
    };
    // send the coords to other users
    socket.emit('line', coord);
    console.log(lines[0]);

}

function mouseReleased(){
    // increment the line count when the mouse is release
    lineCount++;
    console.log("lineCount:"+ lineCount);

}


function keyPressed() {
    // remove all elements from the canvas
    if (key === 'e') {
        clearCanvas();
        socket.emit('clear', 'clear');
    }

}

document.getElementById("red").addEventListener("click", function(){
    console.log("red");
    currentColour = 'red';
    socket.emit('colour', currentColour);
});

document.getElementById("yellow").addEventListener("click", function(){
    currentColour = 'yellow';
    socket.emit('colour', currentColour);
});