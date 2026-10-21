import type { IGameState } from '../shared/types';
import { getMeasurements } from '../logic/calculate-cauldron';
import { formatTime, pauseGame } from '../logic/timer';

export const measurementsSection = document.createElement('section');
measurementsSection.classList.add('measurements-section');

const temperatureUi = document.createElement('div');
const densityUi = document.createElement('div');
const magicPowerUi = document.createElement('div');
measurementsSection.append(temperatureUi, densityUi, magicPowerUi);

export function renderMeasurements({ activeRecipe, cauldronIngredients }: IGameState) {
  if (!activeRecipe) {
    temperatureUi.textContent = '';
    densityUi.textContent = '';
    magicPowerUi.textContent = '';
    return;
  }

  const { temperature, density, magicPower } = activeRecipe;
  const measurements = getMeasurements(cauldronIngredients);

  temperatureUi.textContent = `min: ${temperature.min}; max: ${temperature.max}; current: ${measurements.temperature}`;
  densityUi.textContent = `min: ${density.min}; max: ${density.max}; current: ${measurements.density}`;
  magicPowerUi.textContent = `min: ${magicPower.min}; max: ${magicPower.max}; current: ${measurements.magicPower}`;
}

export const timerUi = document.createElement('div');
timerUi.classList.add('timer');

export function renderTimer({ timeLeft }: IGameState) {
  timerUi.textContent = formatTime(timeLeft);
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
