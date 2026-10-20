import { createStore } from '../shared/store';
import type { IGameState } from '../shared/types';
import { CHOSEN_DIFFICULTY, MAX_LIVES } from '../shared/constants';
import { getRandomRecipe } from '../logic/recipe-generator';

export function createGameState(initial: IGameState) {
  return createStore<IGameState>(initial);
}

export const gameState = createGameState({
  status: 'playing',
  score: 0,
  timeLeft: 0,
  lives: MAX_LIVES,
  activeRecipe: getRandomRecipe(),
  cauldronIngredients: [],
  shelfStock: {},
  difficulty: CHOSEN_DIFFICULTY,
});
