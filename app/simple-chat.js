const server = require('net').createServer();
let socketCounter = 0;
let sockets = {};

function timestamp() {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes()}`;
}

function setSocketId(socket) {
    socket.id = socketCounter++;
}

function writeHelloMessage(socket) {
    console.log('Client connected');    
    socket.write('Type your nickname: ');
}

function isNewSocket(socket) {
    return !sockets[socket.id];
}

function addNewSocket(socket, data) {    
    socket.name = data.toString().trim();
    socket.write(`Welcome ${socket.name}!\n`);
    sockets[socket.id] = socket;    
}

function processData(data, socket) {
    if(isNewSocket(socket)){
        addNewSocket(socket, data);
        return;
    }
    Object.entries(sockets).forEach(([key, curentSocket]) => {
        if(socket.id == key){
            return;
        }

        curentSocket.write(`${socket.name} ${timestamp()} -> `);
        curentSocket.write(data);
    });
}

function disconetClient(socket) {    
    delete sockets[socket.id];    
    console.log('Client disconnected');
}

server.on('connection', socket => {
     setSocketId(socket); 
     writeHelloMessage(socket);

     socket.on('data', data => {
         processData(data, socket);
        });

     socket.on('end', () => {
         disconetClient(socket);
        });
});

server.listen(8080, () => console.log('Server is ON'));