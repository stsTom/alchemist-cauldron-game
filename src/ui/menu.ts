import type { IGameState } from '../shared/types';
import { continueGame, startGame } from '../logic/brew-check';
import { loadGame } from '../storage/save';
import { openLeaderboard, openSettings } from './dialogs';

export const continueButton = document.createElement('button');
continueButton.textContent = 'Continue Game';
continueButton.addEventListener('click', continueGame);

export const startButton = document.createElement('button');
startButton.classList.add('start-button');
startButton.textContent = 'Start Game';
startButton.addEventListener('click', startGame);

export const leaderboardButton = document.createElement('button');
leaderboardButton.classList.add('leaderboard-button');
leaderboardButton.textContent = 'Leaderboard';
leaderboardButton.addEventListener('click', openLeaderboard);

export const settingsButton = document.createElement('button');
settingsButton.classList.add('settings-button');
settingsButton.textContent = 'Settings';
settingsButton.addEventListener('click', openSettings);

export function renderStartButton({ status }: IGameState) {
  startButton.hidden = status !== 'menu';
  leaderboardButton.hidden = status !== 'menu';
  settingsButton.hidden = status !== 'menu';
  continueButton.hidden = status !== 'menu' || loadGame() === null;
}
