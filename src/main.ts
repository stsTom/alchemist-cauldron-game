import type { IGameState } from './shared/types';
import { gameState } from './state/game-state';
import { startGame } from './logic/brew-check';
import { renderShelf, shelfSection } from './ui/shelf';
import { pauseGame } from './logic/timer';
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
import { renderStatus, statusUi } from './ui/dialogs';

const gamePage = document.querySelector('main');

const recipeSeciton = document.createElement('section');
recipeSeciton.classList.add('recipeSeciton');

function render(state: IGameState) {
  renderTimer(state);
  renderPauseButton(state);
  renderShelf(state);
  renderMeasurements(state);
  renderCauldron(state);
  renderHealth(state);
  renderBrewButton(state);
  renderStatus(state);
}

gameState.subscribe(render);
render(gameState.get());

if (gamePage) {
  gamePage.replaceChildren(
    timerUi,
    pauseButton,
    shelfSection,
    recipeSeciton,
    measurementsSection,
    cauldronUi,
    healthUi,
    brewButton,
    statusUi,
  );
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) pauseGame();
});

startGame();
