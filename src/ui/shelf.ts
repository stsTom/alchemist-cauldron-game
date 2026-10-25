import type { IGameState, IMeasurements } from '../shared/types';
import { addToCauldron, getIngredientById } from '../logic/calculate-cauldron';
import { INGREDIENT_ICONS, STAT_ICONS } from './icons';

export const shelfSection = document.createElement('ul');
shelfSection.classList.add('shelf');

let renderedStock: IGameState['shelfStock'] | null = null;

function formatValue(value: number) {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return '0';
}

function createTooltipLine(key: keyof IMeasurements, label: string, value: number) {
  const icon = document.createElement('img');
  icon.src = STAT_ICONS[key];
  icon.alt = '';

  const text = document.createElement('span');
  text.textContent = label;

  const amount = document.createElement('span');
  amount.classList.add('tooltip-value');
  amount.textContent = formatValue(value);

  const line = document.createElement('p');
  line.classList.add('tooltip-line');
  line.append(icon, text, amount);
  return line;
}

function placeTooltip(card: HTMLElement) {
  const tooltip = card.querySelector<HTMLElement>('.tooltip');
  if (!tooltip) return;

  const rect = card.getBoundingClientRect();
  const fitsRight = rect.right + tooltip.offsetWidth <= window.innerWidth;
  const fitsLeft = rect.left - tooltip.offsetWidth >= 0;
  const isBelow = !fitsRight && !fitsLeft;
  const top = isBelow ? rect.bottom : rect.top;
  tooltip.classList.toggle('tooltip--left', !fitsRight && fitsLeft);
  tooltip.classList.toggle('tooltip--below', isBelow);
  tooltip.classList.toggle('tooltip--up', top + tooltip.offsetHeight > window.innerHeight);
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

    const stockUi = document.createElement('span');
    stockUi.classList.add('ingredient-stock');
    stockUi.textContent = `×${stock}`;

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    const tooltipTitle = document.createElement('p');
    tooltipTitle.classList.add('tooltip-title');
    tooltipTitle.textContent = ingredient.name;
    tooltip.append(
      tooltipTitle,
      createTooltipLine('temperature', 'Temperature', ingredient.temperature),
      createTooltipLine('density', 'Density', ingredient.density),
      createTooltipLine('magicPower', 'Magic Power', ingredient.magicPower),
    );

    ingredientUi.append(icon, name, stockUi, tooltip);
    ingredientUi.draggable = stock > 0;
    ingredientUi.classList.toggle('empty', stock <= 0);
    ingredientUi.addEventListener('click', () => addToCauldron(id));
    ingredientUi.addEventListener('mouseenter', () => placeTooltip(ingredientUi));
    ingredientUi.addEventListener('dragstart', (event) => {
      if (!event.dataTransfer) return;
      event.dataTransfer.setData('text/plain', id);
      event.dataTransfer.effectAllowed = 'copy';
      event.dataTransfer.setDragImage(icon, icon.width / 2, icon.height / 2);
    });

    return ingredientUi;
  });

  shelfSection.replaceChildren(...cards);
  placeAllTooltips();
}
