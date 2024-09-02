const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Listen for incoming socket connections
io.on('connection', (socket) => {
    console.log('New client connected');

    // Update client count when a client connects
    io.emit('clients-total', io.engine.clientsCount);

    // Listen for messages sent by clients
    socket.on('message', (data) => {
        socket.broadcast.emit('chat-message', data); // Broadcast message to other clients
    });

    // Listen for typing feedback sent by clients
    socket.on('feedback', (data) => {
        socket.broadcast.emit('feedback', data); // Broadcast feedback to other clients
    });

    // Update client count when a client disconnects
    socket.on('disconnect', () => {
        io.emit('clients-total', io.engine.clientsCount);
    });
});

// Start server on specified port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
