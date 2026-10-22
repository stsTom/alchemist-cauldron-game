import type { GameOverReason, IGameState } from '../shared/types';
import { pauseGame, resumeGame } from '../logic/timer';
import { goToMenu, startGame } from '../logic/brew-check';
import { gameState } from '../state/game-state';
import { addScore, isTopScore, loadLeaderboard } from '../storage/leaderboard';

const REASON_TEXT: Record<GameOverReason, string> = {
  'time-up': 'Time is up',
  'no-lives': 'No lives left',
  'out-of-ingredients': 'Out of ingredients',
};

const NAME_PATTERN = /^[\p{L}\d _-]{2,15}$/u;
const NAME_ERROR = 'Name must be 2–15 characters: letters, digits, space, _ or -';

const RULES_TITLE = 'How the game works';

const RULES_STEPS = [
  'Start a game. The app picks one random recipe, and the recipe panel shows how many ingredients you may use, for example Ingredients: 0 / 4. When the run starts, the shelf is filled according to the chosen difficulty, the cauldron is still empty, and the score/time/lives switch from the start screen state to the active game state.',
  'Add ingredients from the shelf to the cauldron. The counter grows with every ingredient (1 / 4, 2 / 4 …). At the maximum the shelf is blocked.',
  'Watch the 3 bars: Temperature, Density and Magic Power.',
  'Try to move every value into the recipe target zones.',
  'Click Brew to check the mix. In Level 3, Pour Out is also available.',
  'Keep brewing until time ends, you lose all lives, or the ingredients run out.',
];

const RULES_NOTE =
  'Every ingredient has a limited stock. The number on the shelf card shows how many portions are left';

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

const nameForm = document.createElement('form');
nameForm.classList.add('name-form');

const nameInput = document.createElement('input');
nameInput.placeholder = 'Your name';

const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Submit';

const nameError = document.createElement('p');

nameForm.append(nameInput, submitButton, nameError);

nameForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = nameInput.value.trim();

  if (!NAME_PATTERN.test(name)) {
    nameError.textContent = NAME_ERROR;
    return;
  }

  addScore(name, gameState.get().score);
  gameState.set({ isLeaderboardOpen: true });
});

function resetNameForm() {
  nameInput.value = '';
  nameError.textContent = '';
}

gameOverDialog.body.append(
  gameOverReason,
  gameOverScore,
  nameForm,
  createDialogButton('Play Again', startGame),
  createDialogButton('Main Menu', goToMenu),
);

export function renderStatus({
  status,
  gameOverReason: reason,
  score,
  isLeaderboardOpen,
}: IGameState) {
  statusUi.hidden = status !== 'game-over' || Boolean(isLeaderboardOpen);
  if (statusUi.hidden) {
    resetNameForm();
    return;
  }

  gameOverReason.textContent = reason ? REASON_TEXT[reason] : '';
  gameOverScore.textContent = `Score: ${score}`;
  nameForm.hidden = !isTopScore(score);
}

function formatDate(ms: number) {
  const date = new Date(ms);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${date.getFullYear()} ${hours}:${minutes}`;
}

function createRow(cellTag: 'th' | 'td', values: (string | number)[]) {
  const row = document.createElement('tr');
  row.append(
    ...values.map((value) => {
      const cell = document.createElement(cellTag);
      cell.textContent = String(value);
      return cell;
    }),
  );
  return row;
}

const leaderboardDialog = createDialog('leaderboard', 'Leaderboard');
export const leaderboardUi = leaderboardDialog.root;

const leaderboardTable = document.createElement('table');
const leaderboardHead = document.createElement('thead');
const leaderboardRows = document.createElement('tbody');

leaderboardHead.append(createRow('th', ['Rank', 'Name', 'Score', 'Date']));
leaderboardTable.append(leaderboardHead, leaderboardRows);

leaderboardDialog.body.append(leaderboardTable, createDialogButton('Back', goToMenu));

export function renderLeaderboard({ isLeaderboardOpen }: IGameState) {
  leaderboardUi.hidden = !isLeaderboardOpen;
  if (leaderboardUi.hidden) return;

  const leaderboard = loadLeaderboard();

  if (leaderboard.length === 0) {
    const emptyRow = createRow('td', ['No results yet']);
    emptyRow.cells[0].colSpan = 4;
    leaderboardRows.replaceChildren(emptyRow);
    return;
  }

  leaderboardRows.replaceChildren(
    ...leaderboard.map(({ name, score, date }, index) =>
      createRow('td', [index + 1, name, score, formatDate(date)]),
    ),
  );
}

const pauseDialog = createDialog('pause', 'Paused');
export const pauseUi = pauseDialog.root;

pauseDialog.body.append(
  createDialogButton('Resume', resumeGame),
  createDialogButton('Exit to Menu', goToMenu),
);

export function renderPauseDialog({ status, isHelpOpen }: IGameState) {
  pauseUi.hidden = status !== 'paused' || Boolean(isHelpOpen);
}

const helpDialog = createDialog('help', 'Game rules');
export const helpUi = helpDialog.root;

const rulesTitle = document.createElement('h3');
rulesTitle.textContent = RULES_TITLE;

const rulesList = document.createElement('ol');
rulesList.append(
  ...RULES_STEPS.map((step) => {
    const item = document.createElement('li');
    item.textContent = step;
    return item;
  }),
);

const rulesNote = document.createElement('p');
rulesNote.textContent = RULES_NOTE;

const helpContent = document.createElement('div');
helpContent.classList.add('help-content');
helpContent.append(rulesTitle, rulesList, rulesNote);

let resumeOnHelpClose = false;

function openHelp() {
  resumeOnHelpClose = gameState.get().status === 'playing';
  pauseGame();
  gameState.set({ isHelpOpen: true });
}

function closeHelp() {
  gameState.set({ isHelpOpen: false });
  if (resumeOnHelpClose) resumeGame();
}

helpDialog.body.append(helpContent, createDialogButton('Close', closeHelp));

export const helpButton = document.createElement('button');
helpButton.classList.add('help-button');
helpButton.textContent = 'Help';
helpButton.addEventListener('click', openHelp);

export function renderHelpDialog({ isHelpOpen }: IGameState) {
  helpUi.hidden = !isHelpOpen;
}
