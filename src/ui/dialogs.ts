import type { GameOverReason, IGameState } from '../shared/types';

const REASON_TEXT: Record<GameOverReason, string> = {
  'time-up': 'Time is up',
  'no-lives': 'No lives left',
  'out-of-ingredients': 'Out of ingredients',
};

export const statusUi = document.createElement('section');
statusUi.classList.add('game-over');
statusUi.hidden = true;

const gameOverTitle = document.createElement('h2');
gameOverTitle.textContent = 'Game over';

const gameOverReason = document.createElement('p');
const gameOverScore = document.createElement('p');

statusUi.append(gameOverTitle, gameOverReason, gameOverScore);

export function renderStatus({ status, gameOverReason: reason, score }: IGameState) {
  statusUi.hidden = status !== 'game-over';
  if (statusUi.hidden) return;

  gameOverReason.textContent = reason ? REASON_TEXT[reason] : '';
  gameOverScore.textContent = `Score: ${score}`;
}
