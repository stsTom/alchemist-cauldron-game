import { MAX_LIVES, SCORE_PER_BREW, STARTING_TIME } from '../shared/constants';
import { createMenuState, gameState } from '../state/game-state';
import { getMeasurements, isInRange } from './calculate-cauldron';
import { getRandomRecipe } from './recipe-generator';
import { populateShelf } from './stock';
import { addTimeBonus, endGame, startTimer, stopTimer } from './timer';

export function resetRound() {
  gameState.set({ activeRecipe: getRandomRecipe(), cauldronIngredients: [] });
}

export function clearCauldron() {
  gameState.set({ cauldronIngredients: [] });
}

export function brew() {
  const { status, activeRecipe, cauldronIngredients, shelfStock } = gameState.get();
  if (status !== 'playing' || !activeRecipe || cauldronIngredients.length === 0) return;

  const { temperature, density, magicPower } = getMeasurements(cauldronIngredients);

  const isSuccess =
    isInRange(temperature, activeRecipe.temperature) &&
    isInRange(density, activeRecipe.density) &&
    isInRange(magicPower, activeRecipe.magicPower);

  let { lives, score } = gameState.get();

  if (isSuccess) {
    score += SCORE_PER_BREW;
    gameState.set({ score });
    addTimeBonus();
  } else {
    lives -= 1;
    gameState.set({ lives });
  }

  const isShelfEmpty = Object.values(shelfStock).every((stock) => stock <= 0);

  if (lives > 0 && !isShelfEmpty) {
    if (isSuccess) resetRound();
    else clearCauldron();
    return;
  }

  endGame(lives <= 0 ? 'no-lives' : 'out-of-ingredients');
}

export function startGame() {
  gameState.set({
    status: 'playing',
    score: 0,
    lives: MAX_LIVES,
    timeLeft: STARTING_TIME,
    gameOverReason: null,
  });
  resetRound();
  populateShelf();
  startTimer();
}

export function goToMenu() {
  stopTimer();
  gameState.set(createMenuState());
}
