import type { GameOverReason } from '../shared/types';
import { gameState, getSettings } from '../state/game-state';

const TICK_INTERVAL = 250;

let endTime = 0;
let intervalId: number | null = null;

export function formatTime(timeLeft: number) {
  const totalSeconds = Math.ceil(Math.max(0, timeLeft) / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');

  return `${minutes}:${seconds}`;
}

export function stopTimer() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function endGame(reason: GameOverReason) {
  stopTimer();
  gameState.set({ status: 'game-over', gameOverReason: reason });
}

export function pauseGame() {
  if (gameState.get().status !== 'playing') return;
  stopTimer();
  gameState.set({ status: 'paused' });
}

export function resumeGame() {
  if (gameState.get().status !== 'paused') return;
  gameState.set({ status: 'playing' });
  startTimer();
}

function updateTimer() {
  const timeLeft = Math.max(0, endTime - Date.now());
  gameState.set({ timeLeft });

  if (timeLeft === 0) {
    endGame('time-up');
  }
}

export function startTimer() {
  stopTimer();
  endTime = Date.now() + gameState.get().timeLeft;
  intervalId = window.setInterval(updateTimer, TICK_INTERVAL);
  updateTimer();
}

export function removeTime(ms: number) {
  endTime -= ms;
  updateTimer();
}

export function addTimeBonus() {
  const { timeBonus, startingTime } = getSettings();
  endTime = Math.min(endTime + timeBonus, Date.now() + startingTime);
  updateTimer();
}
