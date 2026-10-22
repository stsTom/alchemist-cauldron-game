import type { Difficulty } from './types';
import DIFFICULTY_SETTINGS from '../data/difficulty.json';

export function getDifficultySettings(difficulty: Difficulty) {
  return {
    shelfSize: DIFFICULTY_SETTINGS['ingredients-on-shelf'][difficulty],
    maxCauldron: DIFFICULTY_SETTINGS['max-ingredients-in-cauldron'][difficulty],
    startingTime: DIFFICULTY_SETTINGS['starting-time'][difficulty] * 1000, // ms
    tolerance: DIFFICULTY_SETTINGS['recipe-tolerance'][difficulty],
    lives: DIFFICULTY_SETTINGS['lives'][difficulty],
    scorePerBrew: DIFFICULTY_SETTINGS['score-per-brew'][difficulty],
    timeBonus: DIFFICULTY_SETTINGS['time-bonus-per-brew'][difficulty] * 1000, // ms
    reactions: DIFFICULTY_SETTINGS['reactions'][difficulty],
  };
}
