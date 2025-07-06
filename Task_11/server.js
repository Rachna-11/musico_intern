const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

// Store connected users: { socketId: { username, room } }
const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // When a client joins the room
  socket.on('join', ({ username, room }) => {
    // Save user info for this connection
    users[socket.id] = { username, room };
    socket.join(room);

    // Send welcome message to the user who joined
    socket.emit('message', `Welcome ${username} to room ${room}!`);

    // Notify other users in the room that a new user joined
    socket.to(room).emit('message', `${username} has joined the room.`);
  });

  // Room messages: send to everyone in the room
  socket.on('chat message', (msg) => {
    const user = users[socket.id];
    if (user && user.room) {
      io.to(user.room).emit('chat message', { username: user.username, text: msg });
    }
  });

  // Private messaging: find a user by their username
  socket.on('private message', ({ to, msg }) => {
    const targetSocketId = Object.keys(users).find(
      (id) => users[id].username === to
    );
    if (targetSocketId) {
      socket.to(targetSocketId).emit('private message', { from: users[socket.id].username, text: msg });
    }
  });

  // On disconnect, notify the room and clean up
  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      socket.to(user.room).emit('message', `${user.username} has left the room.`);
      delete users[socket.id];
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
