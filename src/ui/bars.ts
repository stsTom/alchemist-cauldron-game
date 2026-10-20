import type { IGameState } from '../shared/types';
import { MAX_LIVES } from '../shared/constants';
import { getMeasurements } from '../logic/calculate-cauldron';

export const measurementsSection = document.createElement('section');
measurementsSection.classList.add('measurements-section');

const temperatureUi = document.createElement('div');
const densityUi = document.createElement('div');
const magicPowerUi = document.createElement('div');
measurementsSection.append(temperatureUi, densityUi, magicPowerUi);

export function renderMeasurements({ activeRecipe, cauldronIngredients }: IGameState) {
  const { temperature, density, magicPower } = activeRecipe;
  const measurements = getMeasurements(cauldronIngredients);

  temperatureUi.textContent = `min: ${temperature.min}; max: ${temperature.max}; current: ${measurements.temperature}`;
  densityUi.textContent = `min: ${density.min}; max: ${density.max}; current: ${measurements.density}`;
  magicPowerUi.textContent = `min: ${magicPower.min}; max: ${magicPower.max}; current: ${measurements.magicPower}`;
}

export const healthUi = document.createElement('div');
healthUi.classList.add('health');

export function renderHealth({ lives }: IGameState) {
  healthUi.textContent = `Lives: ${lives} / ${MAX_LIVES}`;
}
