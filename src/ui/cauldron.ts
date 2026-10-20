import type { IGameState } from '../shared/types';
import { MAX_CAULDRON_INGREDIENTS } from '../shared/constants';
import { brew } from '../logic/brew-check';

export const cauldronUi = document.createElement('div');
cauldronUi.classList.add('cauldron');

export function renderCauldron({ cauldronIngredients }: IGameState) {
  cauldronUi.textContent = `Cauldron: ${cauldronIngredients.length} / ${MAX_CAULDRON_INGREDIENTS}`;
}

export const brewButton = document.createElement('button');
brewButton.classList.add('brew-button');
brewButton.textContent = 'Brew';
brewButton.addEventListener('click', brew);

export function renderBrewButton({ status }: IGameState) {
  brewButton.disabled = status === 'game-over';
}
