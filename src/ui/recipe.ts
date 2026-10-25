import type { IGameState, IMeasurements } from '../shared/types';
import { getDifficultySettings } from '../shared/difficulty';
import { STAT_ICONS } from './icons';

const STAT_LABELS: Record<keyof IMeasurements, string> = {
  temperature: 'Temperature',
  density: 'Density',
  magicPower: 'Magic Power',
};

export const recipeUi = document.createElement('div');
recipeUi.classList.add('recipe');

const captionUi = document.createElement('p');
captionUi.classList.add('recipe-caption');
captionUi.textContent = 'Current recipe';

const nameUi = document.createElement('h2');
nameUi.classList.add('recipe-name');

const rangesUi = document.createElement('ul');
rangesUi.classList.add('recipe-ranges');

const countUi = document.createElement('p');
countUi.classList.add('recipe-count');

const statKeys = Object.keys(STAT_LABELS) as (keyof IMeasurements)[];
const rangeValues = statKeys.map((key) => {
  const icon = document.createElement('img');
  icon.classList.add('recipe-icon');
  icon.src = STAT_ICONS[key];
  icon.alt = '';

  const label = document.createElement('span');
  label.textContent = STAT_LABELS[key];

  const value = document.createElement('span');
  value.classList.add('recipe-value');

  const row = document.createElement('li');
  row.append(icon, label, value);
  rangesUi.append(row);
  return value;
});

recipeUi.append(captionUi, nameUi, rangesUi, countUi);

export function renderRecipe({ activeRecipe, cauldronIngredients, difficulty }: IGameState) {
  recipeUi.hidden = !activeRecipe;
  if (!activeRecipe) return;

  nameUi.textContent = activeRecipe.name;
  statKeys.forEach((key, index) => {
    const { min, max } = activeRecipe[key];
    rangeValues[index].textContent = `${min} – ${max}`;
  });
  const { maxCauldron } = getDifficultySettings(difficulty);
  countUi.textContent = `Ingredients: ${cauldronIngredients.length} / ${maxCauldron}`;
}
