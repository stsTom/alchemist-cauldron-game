import './styles/style.scss';
import type { IGameState } from './shared/types';
import { gameState } from './state/game-state';
import { pauseGame } from './logic/timer';
import { clearSave, saveGame } from './storage/save';
import { renderShelf, shelfSection } from './ui/shelf';
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
recipeSeciton.append(reactionsUi);

const playField = document.createElement('div');
playField.classList.add('play-field');
playField.append(
  timerUi,
  scoreUi,
  shelfSection,
  recipeSeciton,
  measurementsSection,
  cauldronUi,
  healthUi,
  brewButton,
  pourOutButton,
  continueButton,
  startButton,
  leaderboardButton,
  settingsButton,
);

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
    pauseButton,
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
