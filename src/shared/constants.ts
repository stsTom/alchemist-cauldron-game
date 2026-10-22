import type { Difficulty, IRecipeRange } from './types';
import DIFFICULTY_SETTINGS from '../data/difficulty.json';

export const CHOSEN_DIFFICULTY = 'medium' as Difficulty;

export const MAX_LIVES = DIFFICULTY_SETTINGS['lives'][CHOSEN_DIFFICULTY];
export const SHELF_VOLUME = DIFFICULTY_SETTINGS['ingredients-on-shelf'][CHOSEN_DIFFICULTY];
export const MAX_CAULDRON_INGREDIENTS =
  DIFFICULTY_SETTINGS['max-ingredients-in-cauldron'][CHOSEN_DIFFICULTY];
export const STARTING_TIME = DIFFICULTY_SETTINGS['starting-time'][CHOSEN_DIFFICULTY] * 1000; // ms
export const SCORE_PER_BREW = DIFFICULTY_SETTINGS['score-per-brew'][CHOSEN_DIFFICULTY];
export const TIME_BONUS = DIFFICULTY_SETTINGS['time-bonus-per-brew'][CHOSEN_DIFFICULTY] * 1000; // ms
export const LOW_TIME_THRESHOLD = 15 * 1000; // ms
export const RECIPE_TOLERANCE = DIFFICULTY_SETTINGS['recipe-tolerance'][CHOSEN_DIFFICULTY];
export const LEADERBOARD_KEY = 'alchemist-cauldron-leaderboard';
export const LEADERBOARD_SIZE = 10;
export const { min: MIN_STOCK, max: MAX_STOCK }: IRecipeRange = { min: 2, max: 15 };
