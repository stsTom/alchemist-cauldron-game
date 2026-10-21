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
export const { min: MIN_STOCK, max: MAX_STOCK }: IRecipeRange = { min: 2, max: 15 };
