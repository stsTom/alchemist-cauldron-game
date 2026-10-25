import type { IGameState, IMeasurements, IRecipeRange } from '../shared/types';
import { getMeasurements, isInRange } from '../logic/calculate-cauldron';
import { getReactionsByIds } from '../logic/reactions';
import { formatTime, pauseGame } from '../logic/timer';
import { LOW_TIME_THRESHOLD, MEASUREMENT_SCALES } from '../shared/constants';
import { getDifficultySettings } from '../shared/difficulty';
import { CONTROL_ICONS, STAT_ICONS, setIconButton } from './icons';
import markerSrc from '../assets/marker.svg';

export const measurementsSection = document.createElement('section');
measurementsSection.classList.add('measurements-section');

function create<K extends keyof HTMLElementTagNameMap>(tag: K, className: string) {
  const element = document.createElement(tag);
  element.classList.add(className);
  return element;
}

function createBar(key: keyof IMeasurements, label: string) {
  const root = create('div', 'bar');
  root.classList.add(`bar--${key}`);
  const title = create('span', 'bar-label');
  const icon = create('img', 'bar-icon');
  const track = create('div', 'bar-track');
  const zone = create('div', 'bar-zone');
  const marker = create('div', 'bar-marker');
  const markerImage = create('img', 'bar-marker-image');
  const value = create('span', 'bar-value');
  const scale = create('div', 'bar-scale');
  const [scaleMin, scaleMax] = [create('span', 'bar-scale-end'), create('span', 'bar-scale-end')];
  const [zoneMin, zoneMax] = [create('span', 'bar-zone-label'), create('span', 'bar-zone-label')];

  icon.src = STAT_ICONS[key];
  icon.alt = '';
  markerImage.src = markerSrc;
  markerImage.alt = '';
  title.append(icon, label);
  marker.append(markerImage, value);
  track.append(zone, marker);
  scale.append(scaleMin, zoneMin, zoneMax, scaleMax);
  root.append(title, track, scale);
  return { root, zone, marker, value, zoneMin, zoneMax, scaleMin, scaleMax };
}

const bars: Record<keyof IMeasurements, ReturnType<typeof createBar>> = {
  temperature: createBar('temperature', 'Temperature'),
  density: createBar('density', 'Density'),
  magicPower: createBar('magicPower', 'Magic Power'),
};
const barKeys = Object.keys(bars) as (keyof IMeasurements)[];
measurementsSection.append(...barKeys.map((key) => bars[key].root));

function toPercent(value: number, { min, max }: IRecipeRange) {
  return Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
}

function renderBar(
  bar: ReturnType<typeof createBar>,
  current: number,
  range: IRecipeRange,
  scale: IRecipeRange,
) {
  const left = toPercent(range.min, scale);
  const right = toPercent(range.max, scale);

  bar.marker.style.left = `${toPercent(current, scale)}%`;
  bar.value.textContent = String(current);
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
    renderBar(bars[key], measurements[key], range, MEASUREMENT_SCALES[key]);
    bars[key].root.classList.toggle('in-range', isInRange(measurements[key], range));
  });
}

export const timerUi = document.createElement('div');
timerUi.classList.add('timer');
const timerIcon = create('img', 'timer-icon');
timerIcon.src = CONTROL_ICONS.clock;
timerIcon.alt = '';
const timerText = document.createElement('span');
timerUi.append(timerIcon, timerText);

export function renderTimer({ status, timeLeft }: IGameState) {
  timerText.textContent = formatTime(timeLeft);
  timerUi.classList.toggle('low-time', status === 'playing' && timeLeft < LOW_TIME_THRESHOLD);
}

export const scoreUi = document.createElement('div');
scoreUi.classList.add('score');

export function renderScore({ score }: IGameState) {
  scoreUi.textContent = `Score: ${score}`;
}

export const pauseButton = document.createElement('button');
pauseButton.classList.add('pause-button');
setIconButton(pauseButton, CONTROL_ICONS.pause, 'Pause');
pauseButton.addEventListener('click', pauseGame);

export function renderPauseButton({ status }: IGameState) {
  pauseButton.hidden = status !== 'playing';
}

export const healthUi = document.createElement('div');
healthUi.classList.add('health');

let renderedHealth = '';

export function renderHealth({ status, lives, difficulty }: IGameState) {
  const maxLives = getDifficultySettings(difficulty).lives;
  healthUi.hidden = status === 'menu';
  if (renderedHealth === `${lives}/${maxLives}`) return;
  renderedHealth = `${lives}/${maxLives}`;

  const hearts = Array.from({ length: maxLives }, (_, index) => {
    const heart = create('img', 'heart');
    heart.src = index < lives ? CONTROL_ICONS.heart : CONTROL_ICONS.heartEmpty;
    heart.alt = '';
    return heart;
  });
  healthUi.replaceChildren(...hearts);
  healthUi.ariaLabel = `Lives: ${lives}`;
}
