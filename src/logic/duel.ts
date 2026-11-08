import type { Difficulty, DuelMessage, DuelRole, IDuelState, IGameState } from '../shared/types';
import { send } from '../net/socket';
import { getDifficultySettings } from '../shared/difficulty';
import { gameState } from '../state/game-state';
import { startGame } from './brew-check';
import { stopTimer } from './timer';

let sentScore: number | null = null;
let sentLives: number | null = null;
let isFinishedSent = false;

export function createDuelState(role: DuelRole): IDuelState {
  return {
    role,
    code: '',
    phase: role === 'host' ? 'connecting' : 'code-input',
    opponentScore: 0,
    opponentLives: 0,
    opponentFinished: false,
    opponentLeft: false,
    wantsRematch: false,
    opponentWantsRematch: false,
  };
}

export function setDuel(patch: Partial<IDuelState>) {
  const { duel } = gameState.get();
  if (duel) gameState.set({ duel: { ...duel, ...patch } });
}

function beginGame(difficulty: Difficulty) {
  sentScore = null;
  sentLives = null;

  gameState.set({ difficulty });
  setDuel({
    phase: 'playing',
    opponentScore: 0,
    opponentLives: getDifficultySettings(difficulty).lives,
    opponentFinished: false,
    opponentLeft: false,
    wantsRematch: false,
    opponentWantsRematch: false,
  });
  startGame();
}

export function startDuel() {
  const { duel, difficulty } = gameState.get();
  if (duel?.role !== 'host') return;

  send({ type: 'start', difficulty });
  beginGame(difficulty);
}

export function requestRematch() {
  const { duel } = gameState.get();
  if (!duel || duel.wantsRematch) return;

  setDuel({ wantsRematch: true });
  send({ type: 'rematch' });
  if (duel.opponentWantsRematch) startDuel();
}

export function handleGameMessage(msg: DuelMessage) {
  const { duel } = gameState.get();
  if (!duel) return;

  switch (msg.type) {
    case 'start':
      beginGame(msg.difficulty);
      break;
    case 'progress':
      setDuel({ opponentScore: msg.score, opponentLives: msg.lives });
      break;
    case 'finished':
      setDuel({ opponentScore: msg.score, opponentFinished: true });
      break;
    case 'rematch':
      setDuel({ opponentWantsRematch: true });
      if (duel.wantsRematch) startDuel();
      break;
  }
}

export function opponentLeftDuringGame() {
  stopTimer();
  if (gameState.get().status === 'playing') gameState.set({ status: 'game-over' });
  setDuel({ opponentLeft: true });
}

function syncProgress({ mode, duel, status, score, lives, gameOverReason }: IGameState) {
  if (mode !== 'duel' || duel?.phase !== 'playing') return;

  if (status === 'playing') isFinishedSent = false;

  if (status === 'playing' && (score !== sentScore || lives !== sentLives)) {
    sentScore = score;
    sentLives = lives;
    send({ type: 'progress', score, lives });
  }

  if (status === 'game-over' && !isFinishedSent && gameOverReason) {
    isFinishedSent = true;
    send({ type: 'finished', score, reason: gameOverReason });
  }
}

gameState.subscribe(syncProgress);
