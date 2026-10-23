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

const cauldronCountUi = document.createElement('p');
const cauldronContentsUi = document.createElement('ul');

export const cauldronUi = document.createElement('section');
cauldronUi.classList.add('cauldron');
cauldronUi.append(cauldronCountUi, cauldronContentsUi);

export function renderCauldron({ cauldronIngredients, difficulty }: IGameState) {
  const { maxCauldron } = getDifficultySettings(difficulty);
  cauldronCountUi.textContent = `Cauldron: ${cauldronIngredients.length} / ${maxCauldron}`;
  cauldronUi.classList.toggle('full', cauldronIngredients.length >= maxCauldron);

  const items = cauldronIngredients.map(({ name }) => {
    const item = document.createElement('li');
    item.textContent = name;
    return item;
  });
  cauldronContentsUi.replaceChildren(...items);
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
