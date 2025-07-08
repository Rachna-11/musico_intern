const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', ({ username, room }) => {

    users[socket.id] = { username, room };
    socket.join(room);

    socket.emit('message', `Welcome ${username} to room ${room}!`);

    socket.to(room).emit('message', `${username} has joined the room.`);
  });

  socket.on('chat message', (msg) => {
    const user = users[socket.id];
    if (user && user.room) {
      io.to(user.room).emit('chat message', { username: user.username, text: msg });
    }
  });

  socket.on('private message', ({ to, msg }) => {
    const targetSocketId = Object.keys(users).find(
      (id) => users[id].username === to
    );
    if (targetSocketId) {
      socket.to(targetSocketId).emit('private message', { from: users[socket.id].username, text: msg });
    }
  });

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
