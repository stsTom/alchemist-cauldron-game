import { WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT) || 3000;

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (socket) => {
  console.log('client connected');

  socket.on('message', (raw) => {
    console.log('message:', raw.toString());
  });

  socket.on('close', () => {
    console.log('client disconnected');
  });
});

console.log(`server listening on ws://localhost:${PORT}`);
