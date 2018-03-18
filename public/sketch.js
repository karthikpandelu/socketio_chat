var socket;

function setup(){
    createCanvas(1270, 625);
    background(51);

    socket = io.connect('http://localhost:3000');

    socket.on('mouse', newDrawing);
}

function newDrawing(data){
    noStroke();
    fill(255, 0, 125);
    ellipse(data.x, data.y, 5, 5);
}

function mouseDragged(){
    var data = {
        x: mouseX,
        y: mouseY
    }

    socket.emit('mouse', data);

    noStroke();
    fill(255);
    ellipse(mouseX, mouseY, 5, 5);
}