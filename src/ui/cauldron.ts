import type { IGameState } from '../shared/types';
import { getDifficultySettings } from '../shared/difficulty';
import { brew, pourOut } from '../logic/brew-check';
import { getReactionsByIds } from '../logic/reactions';
import { addToCauldron } from '../logic/calculate-cauldron';
import { gameState, getSettings } from '../state/game-state';
import { INGREDIENT_ICONS } from './icons';
import cauldronSrc from '../assets/cauldron.svg';
import potionSrc from '../assets/potion.svg';
import fireSrc from '../assets/fire.svg';

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

function createImage(src: string, className: string) {
  const image = document.createElement('img');
  image.classList.add(className);
  image.src = src;
  image.alt = '';
  return image;
}

const cauldronCountUi = document.createElement('p');
cauldronCountUi.classList.add('cauldron-count');
const cauldronContentsUi = document.createElement('ul');
cauldronContentsUi.classList.add('cauldron-contents');
const potionUi = createImage(potionSrc, 'cauldron-potion');

const vesselUi = document.createElement('div');
vesselUi.classList.add('cauldron-vessel');
vesselUi.append(
  createImage(cauldronSrc, 'cauldron-pot'),
  potionUi,
  cauldronContentsUi,
  cauldronCountUi,
);

export const cauldronUi = document.createElement('section');
cauldronUi.classList.add('cauldron');
cauldronUi.append(vesselUi, createImage(fireSrc, 'cauldron-fire'));

function canDrop() {
  const { status, cauldronIngredients } = gameState.get();
  return status === 'playing' && cauldronIngredients.length < getSettings().maxCauldron;
}

function handleDragOver(event: DragEvent) {
  if (!canDrop()) return;
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  cauldronUi.classList.add('drop-target');
}

function handleDragLeave(event: DragEvent) {
  if (cauldronUi.contains(event.relatedTarget as Node | null)) return;
  cauldronUi.classList.remove('drop-target');
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  cauldronUi.classList.remove('drop-target');
  if (!canDrop()) return;
  const id = event.dataTransfer?.getData('text/plain');
  if (id) addToCauldron(id);
}

cauldronUi.addEventListener('dragover', handleDragOver);
cauldronUi.addEventListener('dragleave', handleDragLeave);
cauldronUi.addEventListener('drop', handleDrop);

export function renderCauldron({ cauldronIngredients, difficulty }: IGameState) {
  const { maxCauldron } = getDifficultySettings(difficulty);
  cauldronCountUi.textContent = `${cauldronIngredients.length} / ${maxCauldron}`;
  cauldronUi.classList.toggle('full', cauldronIngredients.length >= maxCauldron);
  potionUi.hidden = cauldronIngredients.length === 0;
  potionUi.style.scale = String(0.5 + (0.5 * cauldronIngredients.length) / maxCauldron);

  const items = cauldronIngredients.map(({ id, name }) => {
    const item = document.createElement('li');
    item.append(createImage(INGREDIENT_ICONS[id], 'cauldron-item'));
    item.title = name;
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
