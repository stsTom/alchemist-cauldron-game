import type { GameOverReason, IGameState } from '../shared/types';
import { pauseGame, resumeGame } from '../logic/timer';
import { goToMenu, startGame } from '../logic/brew-check';
import { gameState } from '../state/game-state';

const REASON_TEXT: Record<GameOverReason, string> = {
  'time-up': 'Time is up',
  'no-lives': 'No lives left',
  'out-of-ingredients': 'Out of ingredients',
};

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

gameOverDialog.body.append(
  gameOverReason,
  gameOverScore,
  createDialogButton('Play Again', startGame),
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
