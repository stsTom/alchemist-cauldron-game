import type { IGameState } from '../shared/types';

export const statusUi = document.createElement('div');
statusUi.classList.add('status');

export function renderStatus({ status, lives }: IGameState) {
  if (status !== 'game-over') {
    statusUi.textContent = '';
    return;
  }

  statusUi.textContent = lives > 0 ? 'Out of ingredients. Game over' : 'No lives left. Game over';
}
