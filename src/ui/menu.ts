import type { IGameState } from '../shared/types';
import { startGame } from '../logic/brew-check';
import { loadGame } from '../storage/save';
import { openLeaderboard, openSettings } from './dialogs';

export const continueButton = document.createElement('button');
continueButton.textContent = 'Continue Game';

export const startButton = document.createElement('button');
startButton.classList.add('start-button');
startButton.textContent = 'Start Game';
startButton.addEventListener('click', startGame);

export const leaderboardButton = document.createElement('button');
leaderboardButton.textContent = 'Leaderboard';
leaderboardButton.addEventListener('click', openLeaderboard);

export const settingsButton = document.createElement('button');
settingsButton.textContent = 'Settings';
settingsButton.addEventListener('click', openSettings);

export function renderStartButton({ status }: IGameState) {
  startButton.hidden = status !== 'menu';
  leaderboardButton.hidden = status !== 'menu';
  settingsButton.hidden = status !== 'menu';
  continueButton.hidden = status !== 'menu' || loadGame() === null;
}
