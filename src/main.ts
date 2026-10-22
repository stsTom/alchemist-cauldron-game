import './styles/style.scss';
import type { IGameState } from './shared/types';
import { gameState } from './state/game-state';
import { pauseGame } from './logic/timer';
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
import { brewButton, cauldronUi, renderBrewButton, renderCauldron } from './ui/cauldron';
import {
  clearConfirmUi,
  helpButton,
  helpUi,
  leaderboardUi,
  pauseUi,
  renderClearConfirm,
  renderHelpDialog,
  renderLeaderboard,
  renderPauseDialog,
  renderStatus,
  statusUi,
} from './ui/dialogs';
import { leaderboardButton, renderStartButton, startButton } from './ui/menu';

const gamePage = document.querySelector('main');

const recipeSeciton = document.createElement('section');
recipeSeciton.classList.add('recipeSeciton');

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
  startButton,
  leaderboardButton,
);

function renderPlayField({ status, isHelpOpen, isLeaderboardOpen }: IGameState) {
  const isPaused = status === 'paused' || Boolean(isHelpOpen) || Boolean(isLeaderboardOpen);
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
  renderHealth(state);
  renderBrewButton(state);
  renderStartButton(state);
  renderPlayField(state);
  renderStatus(state);
  renderPauseDialog(state);
  renderHelpDialog(state);
  renderLeaderboard(state);
  renderClearConfirm(state);
}

gameState.subscribe(render);
render(gameState.get());

if (gamePage) {
  gamePage.replaceChildren(
    helpButton,
    pauseButton,
    playField,
    statusUi,
    pauseUi,
    helpUi,
    leaderboardUi,
    clearConfirmUi,
  );
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
});
