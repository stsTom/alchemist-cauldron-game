import type { IGameState, IMeasurements, IRecipeRange } from '../shared/types';
import { getMeasurements, isInRange } from '../logic/calculate-cauldron';
import { getReactionsByIds } from '../logic/reactions';
import { formatTime, pauseGame } from '../logic/timer';
import { LOW_TIME_THRESHOLD, MEASUREMENT_SCALES } from '../shared/constants';

export const measurementsSection = document.createElement('section');
measurementsSection.classList.add('measurements-section');

function create<K extends keyof HTMLElementTagNameMap>(tag: K, className: string) {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
}

function createBar(label: string) {
  const root = create('div', 'bar');
  const title = create('span', 'bar-label');
  const track = create('div', 'bar-track');
  const zone = create('div', 'bar-zone');
  const scale = create('div', 'bar-scale');
  const [scaleMin, scaleMax] = [create('span', 'bar-scale-end'), create('span', 'bar-scale-end')];
  const [zoneMin, zoneMax] = [create('span', 'bar-zone-label'), create('span', 'bar-zone-label')];

  title.textContent = label;
  track.append(zone);
  scale.append(scaleMin, zoneMin, zoneMax, scaleMax);
  root.append(title, track, scale);
  return { root, zone, zoneMin, zoneMax, scaleMin, scaleMax };
}

const bars: Record<keyof IMeasurements, ReturnType<typeof createBar>> = {
  temperature: createBar('Temperature'),
  density: createBar('Density'),
  magicPower: createBar('Magic Power'),
};
const barKeys = Object.keys(bars) as (keyof IMeasurements)[];
measurementsSection.append(...barKeys.map((key) => bars[key].root));

function toPercent(value: number, { min, max }: IRecipeRange) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function renderBar(bar: ReturnType<typeof createBar>, range: IRecipeRange, scale: IRecipeRange) {
  const left = toPercent(range.min, scale);
  const right = toPercent(range.max, scale);

  bar.zone.style.left = `${left}%`;
  bar.zone.style.width = `${right - left}%`;
  bar.zoneMin.style.left = `${left}%`;
  bar.zoneMax.style.left = `${right}%`;
  bar.zoneMin.textContent = String(range.min);
  bar.zoneMax.textContent = String(range.max);
  bar.scaleMin.textContent = String(scale.min);
  bar.scaleMax.textContent = String(scale.max);
}

export function renderMeasurements({ activeRecipe, cauldronIngredients, reactionIds }: IGameState) {
  measurementsSection.classList.toggle('no-recipe', !activeRecipe);

  if (!activeRecipe) {
    barKeys.forEach((key) => bars[key].root.classList.remove('in-range'));
    return;
  }

  const measurements = getMeasurements(cauldronIngredients, getReactionsByIds(reactionIds));

  barKeys.forEach((key) => {
    const range = activeRecipe[key];
    renderBar(bars[key], range, MEASUREMENT_SCALES[key]);
    bars[key].root.classList.toggle('in-range', isInRange(measurements[key], range));
  });
}

export const timerUi = document.createElement('div');
timerUi.classList.add('timer');

export function renderTimer({ status, timeLeft }: IGameState) {
  timerUi.textContent = formatTime(timeLeft);
  timerUi.classList.toggle('low-time', status === 'playing' && timeLeft < LOW_TIME_THRESHOLD);
}

export const scoreUi = document.createElement('div');
scoreUi.classList.add('score');

export function renderScore({ score }: IGameState) {
  scoreUi.textContent = `Score: ${score}`;
}

export const pauseButton = document.createElement('button');
pauseButton.classList.add('pause-button');
pauseButton.textContent = 'Pause';
pauseButton.addEventListener('click', pauseGame);

export function renderPauseButton({ status }: IGameState) {
  pauseButton.hidden = status !== 'playing';
}

export const healthUi = document.createElement('div');
healthUi.classList.add('health');

export function renderHealth({ lives }: IGameState) {
  healthUi.textContent = '❤'.repeat(lives);
}
