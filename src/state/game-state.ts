import { createStore } from '../shared/store';
import type { IGameState } from '../shared/types';
import { CHOSEN_DIFFICULTY } from '../shared/constants';

export function createGameState(initial: IGameState) {
  return createStore<IGameState>(initial);
}

// Start screen: nothing on the shelf, in the cauldron or in the bars until the first run
export function createMenuState(): IGameState {
  return {
    status: 'menu',
    score: 0,
    timeLeft: 0,
    lives: 0,
    gameOverReason: null,
    activeRecipe: null,
    cauldronIngredients: [],
    shelfStock: {},
    isLeaderboardOpen: false,
    difficulty: CHOSEN_DIFFICULTY,
  };
}

export const gameState = createGameState(createMenuState());
