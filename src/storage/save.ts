import type { IGameState, ISavedGame } from '../shared/types';
import { SAVE_KEY } from '../shared/constants';

export function saveGame({
  difficulty,
  score,
  timeLeft,
  lives,
  activeRecipe,
  cauldronIngredients,
  shelfStock,
  status,
}: IGameState) {
  const save: ISavedGame = {
    difficulty,
    score,
    timeLeft,
    lives,
    activeRecipe,
    cauldronIngredients,
    shelfStock,
    status,
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // storage unavailable or full: keep playing without saving
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // storage unavailable: nothing to clear
  }
}
