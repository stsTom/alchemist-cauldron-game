import type { DuelMessage, IDuelState } from '../shared/types';
import { connect, disconnect, onClose, onMessage, send } from '../net/socket';
import { gameState } from '../state/game-state';

const CONNECT_TIMEOUT_MS = 60_000;
const CONNECT_ERROR = 'Could not connect to the server';

let unsubscribers: (() => void)[] = [];
let pending: object | null = null;

function setDuel(patch: Partial<IDuelState>) {
  const { duel } = gameState.get();
  if (duel) gameState.set({ duel: { ...duel, ...patch } });
}

async function connectWithTimeout(): Promise<boolean> {
  const token = {};
  pending = token;
  let timer = 0;
  try {
    await Promise.race([
      connect(),
      new Promise((_, reject) => {
        timer = window.setTimeout(() => reject(new Error('timeout')), CONNECT_TIMEOUT_MS);
      }),
    ]);
  } catch (error) {
    if (pending !== token) return false;
    pending = null;
    disconnect();
    throw error;
  } finally {
    clearTimeout(timer);
  }
  if (pending !== token) return false;
  pending = null;
  return true;
}

function listen() {
  unsubscribers.push(
    onMessage(handleMessage),
    onClose(() => endDuel('Connection lost')),
  );
}

function stopListening() {
  unsubscribers.forEach((unsubscribe) => unsubscribe());
  unsubscribers = [];
}

function handleMessage(msg: DuelMessage) {
  const { duel } = gameState.get();
  if (!duel) return;

  switch (msg.type) {
    case 'created':
      setDuel({ code: msg.code, phase: 'waiting' });
      break;
    case 'opponent-joined':
      setDuel({ phase: 'ready' });
      break;
    case 'error':
      stopListening();
      disconnect();
      setDuel({ phase: 'code-input', error: 'Room not found or full' });
      break;
    case 'opponent-left':
      if (duel.role === 'host') setDuel({ phase: 'waiting' });
      else endDuel('Host left');
      break;
  }
}

function endDuel(notice: string | null) {
  pending = null;
  stopListening();
  disconnect();
  gameState.set({ mode: 'solo', duel: null, duelNotice: notice });
}

export async function createDuel() {
  gameState.set({ mode: 'duel', duel: { role: 'host', code: '', phase: 'connecting' } });
  try {
    if (!(await connectWithTimeout())) return;
  } catch {
    endDuel(CONNECT_ERROR);
    return;
  }
  listen();
  send({ type: 'create' });
}

export function openJoin() {
  gameState.set({ mode: 'duel', duel: { role: 'guest', code: '', phase: 'code-input' } });
}

export async function joinDuel(code: string) {
  setDuel({ code, phase: 'connecting', error: null });
  try {
    if (!(await connectWithTimeout())) return;
  } catch {
    setDuel({ phase: 'code-input', error: CONNECT_ERROR });
    return;
  }
  listen();
  send({ type: 'join', code });
  setDuel({ phase: 'joining' });
}

export function leaveDuel() {
  endDuel(null);
}

export function copyCode() {
  const code = gameState.get().duel?.code;
  if (code) navigator.clipboard.writeText(code).catch(() => {});
}
