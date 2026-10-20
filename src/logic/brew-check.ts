import type { IRecipeRange } from '../shared/types';
import { gameState } from '../state/game-state';
import { getMeasurements } from './calculate-cauldron';
import { getRandomRecipe } from './recipe-generator';
import { populateShelf } from './stock';

function isInRange(value: number, { min, max }: IRecipeRange) {
  return value >= min && value <= max;
}

export function resetRound() {
  gameState.set({ activeRecipe: getRandomRecipe(), cauldronIngredients: [] });
}

export function brew() {
  const { activeRecipe, cauldronIngredients, shelfStock } = gameState.get();
  const { temperature, density, magicPower } = getMeasurements(cauldronIngredients);

  const isSuccess =
    isInRange(temperature, activeRecipe.temperature) &&
    isInRange(density, activeRecipe.density) &&
    isInRange(magicPower, activeRecipe.magicPower);

  let { lives } = gameState.get();

  if (!isSuccess) {
    lives -= 1;
    gameState.set({ lives });
  }

  const isShelfEmpty = Object.values(shelfStock).every((stock) => stock <= 0);

  if (lives > 0 && !isShelfEmpty) {
    resetRound();
    return;
  }

  gameState.set({ status: 'game-over' });
}

export function startGame() {
  resetRound();
  populateShelf();
}
