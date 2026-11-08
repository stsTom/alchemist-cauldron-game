import type { DuelMessage } from '../shared/types';

type MessageListener = (msg: DuelMessage) => void;

let socket: WebSocket | null = null;
const messageListeners = new Set<MessageListener>();
const closeListeners = new Set<() => void>();

export function connect(): Promise<void> {
  disconnect();
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    socket = ws;
    ws.onopen = () => resolve();
    ws.onerror = () => reject(new Error('connection failed'));
    ws.onmessage = (event) => {
      let msg: DuelMessage;
      try {
        msg = JSON.parse(event.data);
      } catch {
        return;
      }
      messageListeners.forEach((callback) => callback(msg));
    };
    ws.onclose = () => {
      if (socket !== ws) return;
      socket = null;
      closeListeners.forEach((callback) => callback());
    };
  });
}

export function send(msg: DuelMessage): void {
  if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(msg));
}

export function onMessage(callback: MessageListener): () => void {
  messageListeners.add(callback);
  return () => messageListeners.delete(callback);
}

export function onClose(callback: () => void): () => void {
  closeListeners.add(callback);
  return () => closeListeners.delete(callback);
}

export function disconnect(): void {
  const ws = socket;
  socket = null;
  ws?.close();
}
