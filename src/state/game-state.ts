import { createStore } from '../shared/store';
import type { Difficulty, IGameState } from '../shared/types';
import { DEFAULT_DIFFICULTY } from '../shared/constants';
import { getDifficultySettings } from '../shared/difficulty';

export function createGameState(initial: IGameState) {
  return createStore<IGameState>(initial);
}

export function createMenuState(difficulty: Difficulty = DEFAULT_DIFFICULTY): IGameState {
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
    isClearConfirmOpen: false,
    isScoreSubmitted: false,
    isSettingsOpen: false,
    difficulty,
    reactionIds: [],
  };
}

export const gameState = createGameState(createMenuState());

export function getSettings() {
  return getDifficultySettings(gameState.get().difficulty);
}
