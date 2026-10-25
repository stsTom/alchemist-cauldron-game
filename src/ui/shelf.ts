import type { IGameState } from '../shared/types';
import { addToCauldron, getIngredientById } from '../logic/calculate-cauldron';
import { INGREDIENT_ICONS } from './icons';

export const shelfSection = document.createElement('ul');
shelfSection.classList.add('shelf');

let renderedStock: IGameState['shelfStock'] | null = null;

function formatValue(value: number) {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return '0';
}

function createTooltipLine(label: string, value: number) {
  const line = document.createElement('p');
  line.textContent = `${label}: ${formatValue(value)}`;
  return line;
}

function placeTooltip(card: HTMLElement) {
  const tooltip = card.querySelector<HTMLElement>('.tooltip');
  if (!tooltip) return;

  const rect = card.getBoundingClientRect();
  tooltip.classList.toggle('tooltip--left', rect.right + tooltip.offsetWidth > window.innerWidth);
  tooltip.classList.toggle('tooltip--up', rect.top + tooltip.offsetHeight > window.innerHeight);
}

function placeAllTooltips() {
  shelfSection.querySelectorAll<HTMLElement>('.ingredient-card').forEach(placeTooltip);
}

window.addEventListener('resize', placeAllTooltips);
window.addEventListener('scroll', placeAllTooltips);

export function renderShelf({ shelfStock }: IGameState) {
  if (shelfStock === renderedStock) return;
  renderedStock = shelfStock;

  const cards = Object.entries(shelfStock).map(([id, stock]) => {
    const ingredient = getIngredientById(id);
    const ingredientUi = document.createElement('li');
    ingredientUi.classList.add('ingredient-card');

    if (!ingredient) return ingredientUi;

    const icon = document.createElement('img');
    icon.classList.add('ingredient-icon');
    icon.src = INGREDIENT_ICONS[id];
    icon.alt = '';

    const name = document.createElement('span');
    name.classList.add('ingredient-name');
    name.textContent = ingredient.name;

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    tooltip.append(
      createTooltipLine('Temperature', ingredient.temperature),
      createTooltipLine('Density', ingredient.density),
      createTooltipLine('Magic Power', ingredient.magicPower),
    );

    ingredientUi.append(icon, name, tooltip);
    ingredientUi.draggable = stock > 0;
    ingredientUi.classList.toggle('empty', stock <= 0);
    ingredientUi.addEventListener('click', () => addToCauldron(id));
    ingredientUi.addEventListener('mouseenter', () => placeTooltip(ingredientUi));
    ingredientUi.addEventListener('dragstart', (event) => {
      if (!event.dataTransfer) return;
      event.dataTransfer.setData('text/plain', id);
      event.dataTransfer.effectAllowed = 'copy';
    });

    return ingredientUi;
  });

  shelfSection.replaceChildren(...cards);
  placeAllTooltips();
}
