import type { Difficulty } from '../shared/types';
import { createMenuState, gameState, getSettings } from '../state/game-state';
import { clearSave } from '../storage/save';
import { getMeasurements, isInRange } from './calculate-cauldron';
import { getRandomRecipe } from './recipe-generator';
import { populateShelf } from './stock';
import { addTimeBonus, endGame, startTimer, stopTimer } from './timer';

export function resetRound() {
  gameState.set({
    activeRecipe: getRandomRecipe(gameState.get().difficulty),
    cauldronIngredients: [],
  });
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
    score += getSettings().scorePerBrew;
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
  const { lives, startingTime } = getSettings();

  gameState.set({
    status: 'playing',
    score: 0,
    lives,
    timeLeft: startingTime,
    gameOverReason: null,
    isScoreSubmitted: false,
  });
  resetRound();
  populateShelf();
  startTimer();
}

export function goToMenu() {
  stopTimer();
  clearSave();
  gameState.set(createMenuState(gameState.get().difficulty));
}

export function setDifficulty(difficulty: Difficulty) {
  if (gameState.get().status !== 'menu') return;
  gameState.set({ difficulty });
}
