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
  renderTimer,
  timerUi,
} from './ui/bars';
import { brewButton, cauldronUi, renderBrewButton, renderCauldron } from './ui/cauldron';
import { pauseUi, renderPauseDialog, renderStatus, statusUi } from './ui/dialogs';
import { renderStartButton, startButton } from './ui/menu';

const gamePage = document.querySelector('main');

const recipeSeciton = document.createElement('section');
recipeSeciton.classList.add('recipeSeciton');

const playField = document.createElement('div');
playField.classList.add('play-field');
playField.append(
  timerUi,
  shelfSection,
  recipeSeciton,
  measurementsSection,
  cauldronUi,
  healthUi,
  brewButton,
  startButton,
);

function renderPlayField({ status }: IGameState) {
  const isPaused = status === 'paused';
  playField.classList.toggle('paused', isPaused);
  playField.inert = isPaused;
}

function render(state: IGameState) {
  renderTimer(state);
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
}

gameState.subscribe(render);
render(gameState.get());

if (gamePage) {
  gamePage.replaceChildren(pauseButton, playField, statusUi, pauseUi);
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
});
