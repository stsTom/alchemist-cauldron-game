import type { Difficulty, IRecipe } from '../shared/types';
import RECIPES from '../data/recipes.json';
import { CHOSEN_DIFFICULTY } from '../shared/constants';

export function getRandomRecipe(difficulty: Difficulty = CHOSEN_DIFFICULTY): IRecipe {
  const recipes = RECIPES[difficulty];

  return recipes[Math.round(Math.random() * (recipes.length - 1))] as IRecipe;
}
