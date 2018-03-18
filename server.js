var express = require('express');
var app = express();
var socket = require('socket.io');

// var bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({extended: false}));

// app.use(bodyParser.json());

app.use(express.static('public'));

var server = app.listen(3000);
console.log("Server is listening on port 3000");

var io = socket(server);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});


//chat application part
users = [];
connections = [];

app.get('/chat', function(req, res){
    res.sendFile(__dirname + '/public/chat.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s users connected', connections.length);
    
    //Disc connect
    socket.on('disconnect', function(data){
        
        users.splice(users.indexOf(socket.username), 1);
        updateUsername();
        connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s users connected', connections.length);
    });

    //send message
    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg:data, user: socket.username});
    });

    //new user
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsername();

    })
    function updateUsername(){
        io.sockets.emit('get users', users);
    }
    
} );

app.get('/draw', function(req, res){
    res.sendFile(__dirname + '/public/draw.html');
});

//drawing part
io.sockets.on('connection', newConnection);

function newConnection(socket){
    socket.on('mouse', mouseMessage);

    function mouseMessage(data){
        socket.broadcast.emit('mouse', data);
    }
}