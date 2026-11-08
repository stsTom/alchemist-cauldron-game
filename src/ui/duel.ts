import type { IDuelState, IGameState } from '../shared/types';
import { requestRematch } from '../logic/duel';
import { leaveDuel } from '../logic/lobby';
import { createDialog, createDialogButton, REASON_TEXT } from './dialogs';

export const opponentUi = document.createElement('p');
opponentUi.classList.add('opponent');

export function renderOpponent({ mode, status, duel }: IGameState) {
  opponentUi.hidden = mode !== 'duel' || status === 'menu' || !duel;
  if (!duel) return;

  const finished = duel.opponentFinished ? ' · finished' : '';
  opponentUi.textContent = `Opponent: ${duel.opponentScore} · lives ${duel.opponentLives}${finished}`;
}

const resultDialog = createDialog('duel-result', 'Duel over');
export const resultUi = resultDialog.root;

const resultTitle = document.createElement('h3');
const resultReason = document.createElement('p');
const resultScores = document.createElement('p');
const rematchStatus = document.createElement('p');
const rematchButton = createDialogButton('Rematch', requestRematch);

resultDialog.body.append(
  resultTitle,
  resultReason,
  resultScores,
  rematchStatus,
  rematchButton,
  createDialogButton('Leave', leaveDuel),
);

function getResultTitle(score: number, duel: IDuelState) {
  if (duel.opponentLeft) return 'Opponent left — you win!';
  if (!duel.opponentFinished) return 'Waiting for opponent…';
  if (score > duel.opponentScore) return 'You win!';
  if (score < duel.opponentScore) return 'You lose';
  return 'Draw';
}

function getRematchStatus(duel: IDuelState) {
  if (duel.wantsRematch) return 'Waiting for opponent…';
  if (duel.opponentWantsRematch) return 'Opponent wants a rematch';
  return '';
}

export function renderDuelResult({ mode, status, score, gameOverReason, duel }: IGameState) {
  resultUi.hidden = mode !== 'duel' || status !== 'game-over' || duel?.phase !== 'playing';
  if (resultUi.hidden || !duel) return;

  const canRematch = duel.opponentFinished && !duel.opponentLeft;

  resultTitle.textContent = getResultTitle(score, duel);
  resultReason.textContent = gameOverReason ? REASON_TEXT[gameOverReason] : '';
  resultScores.textContent = duel.opponentFinished
    ? `You: ${score} · Opponent: ${duel.opponentScore}`
    : `Your score: ${score}`;
  rematchStatus.textContent = canRematch ? getRematchStatus(duel) : '';
  rematchButton.hidden = !canRematch;
  rematchButton.disabled = duel.wantsRematch;
}
