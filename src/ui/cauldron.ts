import type { IGameState } from '../shared/types';
import { getDifficultySettings } from '../shared/difficulty';
import { brew, pourOut } from '../logic/brew-check';
import { getReactionsByIds } from '../logic/reactions';

export const reactionsUi = document.createElement('ul');
reactionsUi.classList.add('reactions');

export function renderReactions({ reactionIds, cauldronIngredients }: IGameState) {
  const items = getReactionsByIds(reactionIds).map(({ name, description, isActive }) => {
    const item = document.createElement('li');
    item.textContent = `${name}: ${description}`;
    item.classList.toggle('active', isActive(cauldronIngredients));
    return item;
  });
  reactionsUi.replaceChildren(...items);
}

export const cauldronUi = document.createElement('div');
cauldronUi.classList.add('cauldron');

export function renderCauldron({ cauldronIngredients, difficulty }: IGameState) {
  const { maxCauldron } = getDifficultySettings(difficulty);
  cauldronUi.textContent = `Cauldron: ${cauldronIngredients.length} / ${maxCauldron}`;
  cauldronUi.classList.toggle('full', cauldronIngredients.length >= maxCauldron);
}

export const brewButton = document.createElement('button');
brewButton.classList.add('brew-button');
brewButton.textContent = 'Brew';
brewButton.addEventListener('click', brew);

export function renderBrewButton({ status, cauldronIngredients }: IGameState) {
  brewButton.hidden = status === 'menu';
  brewButton.disabled = status !== 'playing' || cauldronIngredients.length === 0;
}

export const pourOutButton = document.createElement('button');
pourOutButton.classList.add('pour-out-button');
pourOutButton.textContent = 'Pour Out';
pourOutButton.addEventListener('click', pourOut);

export function renderPourOutButton({ status, cauldronIngredients }: IGameState) {
  pourOutButton.hidden = status === 'menu';
  pourOutButton.disabled = status !== 'playing' || cauldronIngredients.length === 0;
}
