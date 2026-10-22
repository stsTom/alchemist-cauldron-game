import type { Difficulty, IRecipe, IRecipeRange } from '../shared/types';
import RECIPES from '../data/recipes.json';
import { getDifficultySettings } from '../shared/difficulty';

function widenRange({ min, max }: IRecipeRange, tolerance: number): IRecipeRange {
  return { min: min - tolerance, max: max + tolerance };
}

export function getRandomRecipe(difficulty: Difficulty): IRecipe {
  const recipes = RECIPES[difficulty];
  const recipe = recipes[Math.round(Math.random() * (recipes.length - 1))] as IRecipe;
  const { tolerance } = getDifficultySettings(difficulty);

  return {
    ...recipe,
    temperature: widenRange(recipe.temperature, tolerance),
    density: widenRange(recipe.density, tolerance),
    magicPower: widenRange(recipe.magicPower, tolerance),
  };
}
