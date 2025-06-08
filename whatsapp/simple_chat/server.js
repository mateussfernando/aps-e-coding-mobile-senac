
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors()); 
app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('newUser', (username) => {
        socket.username = username;
        io.emit('userJoined', username);
    });

    socket.on('chatMessage', (msg) => {
        io.emit('message', { user: socket.username, text: msg });
    });

    socket.on('disconnect', () => {
        io.emit('userLeft', socket.username);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
