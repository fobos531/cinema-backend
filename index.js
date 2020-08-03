const http = require('http');
const socketIo = require('socket.io');
const app = require('./app');


const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('sendMsgToServer', (message) => {
    socket.broadcast.emit('sendMsgToClient', { sender: socket.id, message });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
