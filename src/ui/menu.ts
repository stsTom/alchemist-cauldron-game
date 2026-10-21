import type { IGameState } from '../shared/types';
import { startGame } from '../logic/brew-check';

export const startButton = document.createElement('button');
startButton.classList.add('start-button');
startButton.textContent = 'Start Game';
startButton.addEventListener('click', startGame);

export function renderStartButton({ status }: IGameState) {
  startButton.hidden = status !== 'menu';
}
