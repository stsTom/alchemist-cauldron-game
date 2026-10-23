import type { IGameState } from '../shared/types';
import { getDifficultySettings } from '../shared/difficulty';
import { brew } from '../logic/brew-check';
import { getReactionsByIds } from '../logic/reactions';

export const reactionsUi = document.createElement('ul');
reactionsUi.classList.add('reactions');

export function renderReactions({ reactionIds }: IGameState) {
  const items = getReactionsByIds(reactionIds).map(({ name, description }) => {
    const item = document.createElement('li');
    item.textContent = `${name}: ${description}`;
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
