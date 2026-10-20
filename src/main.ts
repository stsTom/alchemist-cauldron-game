import type { IGameState } from './shared/types';
import { gameState } from './state/game-state';
import { startGame } from './logic/brew-check';
import { renderShelf, shelfSection } from './ui/shelf';
import { healthUi, measurementsSection, renderHealth, renderMeasurements } from './ui/bars';
import { brewButton, cauldronUi, renderBrewButton, renderCauldron } from './ui/cauldron';
import { renderStatus, statusUi } from './ui/dialogs';

const gamePage = document.querySelector('main');

const recipeSeciton = document.createElement('section');
recipeSeciton.classList.add('recipeSeciton');

function render(state: IGameState) {
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
    shelfSection,
    recipeSeciton,
    measurementsSection,
    cauldronUi,
    healthUi,
    brewButton,
    statusUi,
  );
}

startGame();
