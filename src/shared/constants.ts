import type { Difficulty, IMeasurements, IRecipeRange } from './types';

export const DEFAULT_DIFFICULTY: Difficulty = 'medium';
export const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];

export const LOW_TIME_THRESHOLD = 15 * 1000; // ms
export const POUR_OUT_PENALTY = 10 * 1000; // ms
export const LEADERBOARD_KEY = 'alchemist-cauldron-leaderboard';
export const LEADERBOARD_SIZE = 10;
export const SAVE_KEY = 'alchemist-cauldron-save';
export const { min: MIN_STOCK, max: MAX_STOCK }: IRecipeRange = { min: 2, max: 15 };
export const MEASUREMENT_SCALES: Record<keyof IMeasurements, IRecipeRange> = {
  temperature: { min: -200, max: 200 },
  density: { min: -100, max: 100 },
  magicPower: { min: 0, max: 200 },
};
