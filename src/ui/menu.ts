import type { IGameState } from '../shared/types';
import { startGame } from '../logic/brew-check';
import { openLeaderboard } from './dialogs';

export const startButton = document.createElement('button');
startButton.classList.add('start-button');
startButton.textContent = 'Start Game';
startButton.addEventListener('click', startGame);

export const leaderboardButton = document.createElement('button');
leaderboardButton.textContent = 'Leaderboard';
leaderboardButton.addEventListener('click', openLeaderboard);

export function renderStartButton({ status }: IGameState) {
  startButton.hidden = status !== 'menu';
  leaderboardButton.hidden = status !== 'menu';
}
