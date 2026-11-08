import type { DuelPhase, IGameState } from '../shared/types';
import { copyCode, joinDuel, leaveDuel } from '../logic/lobby';
import { gameState } from '../state/game-state';
import { createDialog, createDialogButton } from './dialogs';

const CODE_LENGTH = 5;

const STATUS_TEXT: Record<DuelPhase, string> = {
  'code-input': 'Enter the room code',
  connecting: 'Connecting…',
  waiting: 'Waiting for opponent…',
  joining: 'Joining…',
  ready: 'Opponent connected',
};

const lobbyDialog = createDialog('lobby', 'Duel');
export const lobbyUi = lobbyDialog.root;

const lobbyStatus = document.createElement('p');

const codeRow = document.createElement('p');
const codeText = document.createElement('strong');
codeRow.append('Room code: ', codeText, ' ', createDialogButton('Copy', copyCode));

const joinForm = document.createElement('form');
joinForm.classList.add('name-form');

const codeInput = document.createElement('input');
codeInput.placeholder = 'Code';
codeInput.maxLength = CODE_LENGTH;
codeInput.autocomplete = 'off';

const joinButton = document.createElement('button');
joinButton.type = 'submit';
joinButton.textContent = 'Join';
joinButton.disabled = true;

const joinError = document.createElement('p');

joinForm.append(codeInput, joinButton, joinError);

codeInput.addEventListener('input', () => {
  codeInput.value = codeInput.value.toUpperCase();
  joinButton.disabled = codeInput.value.length !== CODE_LENGTH;
});

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (codeInput.value.length === CODE_LENGTH) joinDuel(codeInput.value);
});

const duelStartButton = createDialogButton('Start', () => {});
duelStartButton.disabled = true;

lobbyDialog.body.append(
  lobbyStatus,
  codeRow,
  joinForm,
  duelStartButton,
  createDialogButton('Leave', leaveDuel),
);

export function renderLobby({ duel }: IGameState) {
  lobbyUi.hidden = duel === null;
  if (!duel) {
    codeInput.value = '';
    joinButton.disabled = true;
    return;
  }

  const isHost = duel.role === 'host';
  lobbyStatus.textContent = STATUS_TEXT[duel.phase];
  codeText.textContent = duel.code;
  codeRow.hidden = !isHost || (duel.phase !== 'waiting' && duel.phase !== 'ready');
  joinForm.hidden = duel.phase !== 'code-input';
  joinError.textContent = duel.error ?? '';
  duelStartButton.hidden = !isHost || duel.phase !== 'ready';
}

const noticeDialog = createDialog('duel-notice', 'Duel');
export const noticeUi = noticeDialog.root;

const noticeText = document.createElement('p');

noticeDialog.body.append(
  noticeText,
  createDialogButton('OK', () => gameState.set({ duelNotice: null })),
);

export function renderDuelNotice({ duelNotice }: IGameState) {
  noticeUi.hidden = !duelNotice;
  noticeText.textContent = duelNotice ?? '';
}
