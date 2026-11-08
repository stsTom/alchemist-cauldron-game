import { WebSocket, WebSocketServer } from 'ws';

const PORT = Number(process.env.PORT) || 3000;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 5;
const HEARTBEAT_MS = 30_000;

interface Room {
  players: WebSocket[];
}

const rooms = new Map<string, Room>();
const roomedSockets = new Map<WebSocket, string>();
const alive = new Set<WebSocket>();

function send(socket: WebSocket, msg: object): void {
  if (socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(msg));
  }
}

function generateCode(): string {
  let code: string;
  do {
    code = '';
    for (let i = 0; i < CODE_LENGTH; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
  } while (rooms.has(code));
  return code;
}

function getOpponent(socket: WebSocket): WebSocket | undefined {
  const code = roomedSockets.get(socket);
  if (!code) return undefined;
  return rooms.get(code)?.players.find((player) => player !== socket);
}

function leaveRoom(socket: WebSocket): void {
  const code = roomedSockets.get(socket);
  if (!code) return;
  roomedSockets.delete(socket);

  const room = rooms.get(code);
  if (!room) return;
  room.players = room.players.filter((player) => player !== socket);

  if (room.players.length === 0) {
    rooms.delete(code);
    console.log(`room ${code} closed`);
  } else {
    room.players.forEach((player) => send(player, { type: 'opponent-left' }));
  }
}

function createRoom(socket: WebSocket): void {
  const code = generateCode();
  rooms.set(code, { players: [socket] });
  roomedSockets.set(socket, code);
  send(socket, { type: 'created', code });
  console.log(`room ${code} created`);
}

function joinRoom(socket: WebSocket, rawCode: unknown): void {
  const code = typeof rawCode === 'string' ? rawCode.toUpperCase() : '';
  const room = rooms.get(code);

  if (!room || room.players.length !== 1) {
    send(socket, { type: 'error', reason: 'room-unavailable' });
    return;
  }

  room.players.push(socket);
  roomedSockets.set(socket, code);
  room.players.forEach((player) => send(player, { type: 'opponent-joined' }));
  console.log(`room ${code} joined`);
}

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', (socket) => {
  alive.add(socket);
  socket.on('pong', () => alive.add(socket));

  socket.on('message', (raw) => {
    const text = raw.toString();
    let msg: { type?: unknown; code?: unknown };
    try {
      msg = JSON.parse(text);
    } catch {
      return;
    }
    if (!msg || typeof msg !== 'object' || typeof msg.type !== 'string') return;

    if (msg.type === 'create') {
      if (!roomedSockets.has(socket)) createRoom(socket);
    } else if (msg.type === 'join') {
      if (!roomedSockets.has(socket)) joinRoom(socket, msg.code);
    } else {
      const opponent = getOpponent(socket);
      if (opponent?.readyState === WebSocket.OPEN) opponent.send(text);
    }
  });

  socket.on('close', () => {
    alive.delete(socket);
    leaveRoom(socket);
  });

  socket.on('error', (error) => {
    console.error('socket error:', error.message);
  });
});

const interval = setInterval(() => {
  wss.clients.forEach((socket) => {
    if (!alive.has(socket)) {
      socket.terminate();
      return;
    }
    alive.delete(socket);
    socket.ping();
  });
}, HEARTBEAT_MS);

wss.on('close', () => clearInterval(interval));

console.log(`server listening on ws://localhost:${PORT}`);
