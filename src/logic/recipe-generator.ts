import type { Difficulty, IRecipe, IRecipeRange } from '../shared/types';
import RECIPES from '../data/recipes.json';
import { CHOSEN_DIFFICULTY, RECIPE_TOLERANCE } from '../shared/constants';

function widenRange({ min, max }: IRecipeRange): IRecipeRange {
  return { min: min - RECIPE_TOLERANCE, max: max + RECIPE_TOLERANCE };
}

export function getRandomRecipe(difficulty: Difficulty = CHOSEN_DIFFICULTY): IRecipe {
  const recipes = RECIPES[difficulty];
  const recipe = recipes[Math.round(Math.random() * (recipes.length - 1))] as IRecipe;

  return {
    ...recipe,
    temperature: widenRange(recipe.temperature),
    density: widenRange(recipe.density),
    magicPower: widenRange(recipe.magicPower),
  };
}
