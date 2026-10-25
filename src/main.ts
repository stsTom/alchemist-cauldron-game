import './styles/style.scss';
import type { IGameState } from './shared/types';
import { gameState } from './state/game-state';
import { pauseGame } from './logic/timer';
import { clearSave, saveGame } from './storage/save';
import { renderShelf, shelfSection } from './ui/shelf';
import { recipeUi, renderRecipe } from './ui/recipe';
import {
  healthUi,
  measurementsSection,
  pauseButton,
  renderHealth,
  renderMeasurements,
  renderPauseButton,
  renderScore,
  renderTimer,
  scoreUi,
  timerUi,
} from './ui/bars';
import {
  brewButton,
  cauldronUi,
  pourOutButton,
  reactionsUi,
  renderBrewButton,
  renderCauldron,
  renderPourOutButton,
  renderReactions,
} from './ui/cauldron';
import {
  clearConfirmUi,
  gameOverUi,
  helpButton,
  helpUi,
  leaderboardUi,
  pauseUi,
  renderClearConfirm,
  renderGameOverDialog,
  renderHelpDialog,
  renderLeaderboard,
  renderPauseDialog,
  renderSettings,
  settingsUi,
} from './ui/dialogs';
import {
  continueButton,
  leaderboardButton,
  renderStartButton,
  settingsButton,
  startButton,
} from './ui/menu';

const gamePage = document.querySelector('main');

const recipeSeciton = document.createElement('section');
recipeSeciton.classList.add('recipeSeciton');
recipeSeciton.append(recipeUi, reactionsUi);

const gameTitle = document.createElement('h1');
gameTitle.classList.add('game-title');
gameTitle.textContent = "Alchemist's Cauldron";

const headerCenter = document.createElement('div');
headerCenter.classList.add('header-center');
headerCenter.append(timerUi, gameTitle);

const header = document.createElement('header');
header.classList.add('game-header');
header.append(scoreUi, headerCenter, healthUi, leaderboardButton);

const shelfArea = document.createElement('aside');
shelfArea.classList.add('shelf-area');
shelfArea.append(shelfSection);

const stage = document.createElement('section');
stage.classList.add('stage');
stage.append(cauldronUi, pourOutButton);

const recipeArea = document.createElement('aside');
recipeArea.classList.add('recipe-area');
recipeArea.append(recipeSeciton);

const footerCenter = document.createElement('div');
footerCenter.classList.add('footer-center');
footerCenter.append(brewButton, startButton, continueButton);

const footer = document.createElement('footer');
footer.classList.add('game-footer');
footer.append(footerCenter, pauseButton, settingsButton);

const playField = document.createElement('div');
playField.classList.add('play-field');
playField.append(header, shelfArea, stage, recipeArea, measurementsSection, footer);

function renderPlayField({ status, isHelpOpen, isLeaderboardOpen, isSettingsOpen }: IGameState) {
  const isPaused =
    status === 'paused' ||
    Boolean(isHelpOpen) ||
    Boolean(isLeaderboardOpen) ||
    Boolean(isSettingsOpen);
  playField.classList.toggle('paused', isPaused);
  playField.inert = isPaused;
}

function render(state: IGameState) {
  renderTimer(state);
  renderScore(state);
  renderPauseButton(state);
  renderShelf(state);
  renderMeasurements(state);
  renderCauldron(state);
  renderReactions(state);
  renderRecipe(state);
  renderHealth(state);
  renderBrewButton(state);
  renderPourOutButton(state);
  renderStartButton(state);
  renderPlayField(state);
  renderGameOverDialog(state);
  renderPauseDialog(state);
  renderHelpDialog(state);
  renderLeaderboard(state);
  renderClearConfirm(state);
  renderSettings(state);
}

gameState.subscribe(render);
gameState.subscribe((state) => {
  if (state.status === 'playing' || state.status === 'paused') saveGame(state);
  if (state.status === 'game-over') clearSave();
});
render(gameState.get());

if (gamePage) {
  gamePage.replaceChildren(
    helpButton,
    playField,
    gameOverUi,
    pauseUi,
    helpUi,
    leaderboardUi,
    clearConfirmUi,
    settingsUi,
  );
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
});
