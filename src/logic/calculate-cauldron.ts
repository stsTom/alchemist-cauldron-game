import type { IIngredient, IRecipeRange } from '../shared/types';
import INGREDIENTS from '../data/ingredients.json';
import { gameState, getSettings } from '../state/game-state';

export interface IMeasurements {
  temperature: number;
  density: number;
  magicPower: number;
}

export function isInRange(value: number, { min, max }: IRecipeRange) {
  return value >= min && value <= max;
}

export function getIngredientById(id: string) {
  return (INGREDIENTS as IIngredient[]).find((ingredient) => ingredient.id === id);
}

export function getMeasurements(cauldronIngredients: IIngredient[]): IMeasurements {
  return cauldronIngredients.reduce(
    (total, ingredient) => ({
      temperature: total.temperature + ingredient.temperature,
      density: total.density + ingredient.density,
      magicPower: total.magicPower + ingredient.magicPower,
    }),
    { temperature: 0, density: 0, magicPower: 0 },
  );
}

export function addToCauldron(ingredientId: string) {
  const { status, shelfStock, cauldronIngredients } = gameState.get();
  if (status !== 'playing') return;

  const ingredient = getIngredientById(ingredientId);
  const stock = shelfStock[ingredientId] ?? 0;

  if (!ingredient || stock <= 0) return;
  if (cauldronIngredients.length >= getSettings().maxCauldron) return;

  gameState.set({
    shelfStock: { ...shelfStock, [ingredientId]: stock - 1 },
    cauldronIngredients: [...cauldronIngredients, ingredient],
  });
}
