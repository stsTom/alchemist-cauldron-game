import type { GameOverReason, IGameState } from '../shared/types';
import { resumeGame } from '../logic/timer';
import { goToMenu } from '../logic/brew-check';

const REASON_TEXT: Record<GameOverReason, string> = {
  'time-up': 'Time is up',
  'no-lives': 'No lives left',
  'out-of-ingredients': 'Out of ingredients',
};

function createDialog(className: string, title: string) {
  const root = document.createElement('section');
  root.classList.add('dialog', className);
  root.hidden = true;

  const heading = document.createElement('h2');
  heading.textContent = title;

  const body = document.createElement('div');
  body.classList.add('dialog-body');

  root.append(heading, body);
  return { root, body };
}

function createDialogButton(label: string, onClick: () => void) {
  const button = document.createElement('button');
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

const gameOverDialog = createDialog('game-over', 'Game over');
export const statusUi = gameOverDialog.root;

const gameOverReason = document.createElement('p');
const gameOverScore = document.createElement('p');

gameOverDialog.body.append(
  gameOverReason,
  gameOverScore,
  createDialogButton('Main Menu', goToMenu),
);

export function renderStatus({ status, gameOverReason: reason, score }: IGameState) {
  statusUi.hidden = status !== 'game-over';
  if (statusUi.hidden) return;

  gameOverReason.textContent = reason ? REASON_TEXT[reason] : '';
  gameOverScore.textContent = `Score: ${score}`;
}

const pauseDialog = createDialog('pause', 'Paused');
export const pauseUi = pauseDialog.root;

pauseDialog.body.append(
  createDialogButton('Resume', resumeGame),
  createDialogButton('Exit to Menu', goToMenu),
);

export function renderPauseDialog({ status }: IGameState) {
  pauseUi.hidden = status !== 'paused';
}
