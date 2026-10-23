import type { IGameState, ISavedGame } from '../shared/types';
import INGREDIENTS from '../data/ingredients.json';
import { DIFFICULTIES, SAVE_KEY } from '../shared/constants';
import { getDifficultySettings } from '../shared/difficulty';

const INGREDIENT_IDS = INGREDIENTS.map(({ id }) => id);

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCount(value: unknown, min = 0): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min;
}

function isRange(value: unknown) {
  return isObject(value) && typeof value.min === 'number' && typeof value.max === 'number';
}

function isRecipe(value: unknown) {
  return (
    isObject(value) &&
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    isRange(value.temperature) &&
    isRange(value.density) &&
    isRange(value.magicPower)
  );
}

function isShelfStock(value: unknown) {
  return (
    isObject(value) &&
    Object.entries(value).every(
      ([id, stock]) => INGREDIENT_IDS.includes(id) && Number.isInteger(stock) && isCount(stock),
    )
  );
}

export function isValidSave(data: unknown): data is ISavedGame {
  if (!isObject(data)) return false;

  const { difficulty, score, timeLeft, lives, activeRecipe, cauldronIngredients, shelfStock } =
    data;

  if (!DIFFICULTIES.includes(difficulty as ISavedGame['difficulty'])) return false;
  if (data.status !== 'playing' && data.status !== 'paused') return false;
  if (!isCount(score) || !isCount(timeLeft, 1) || !isCount(lives, 1)) return false;
  if (!isRecipe(activeRecipe) || !isShelfStock(shelfStock)) return false;

  const { maxCauldron } = getDifficultySettings(difficulty as ISavedGame['difficulty']);

  return (
    Array.isArray(cauldronIngredients) &&
    cauldronIngredients.length <= maxCauldron &&
    cauldronIngredients.every(
      (ingredient) => isObject(ingredient) && INGREDIENT_IDS.includes(ingredient.id as string),
    )
  );
}

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

export function loadGame(): ISavedGame | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw === null) return null;

    const data: unknown = JSON.parse(raw);
    if (isValidSave(data)) return data;
  } catch {
    // broken JSON or storage unavailable: treat as no save
  }

  clearSave();
  return null;
}
