import type { IIngredient, IMeasurements, IReaction, IRecipeRange } from '../shared/types';
import INGREDIENTS from '../data/ingredients.json';
import { REACTIONS } from '../data/reactions';
import { gameState, getSettings } from '../state/game-state';

export function isInRange(value: number, { min, max }: IRecipeRange) {
  return value >= min && value <= max;
}

export function getIngredientById(id: string) {
  return (INGREDIENTS as IIngredient[]).find((ingredient) => ingredient.id === id);
}

export function getMeasurements(
  cauldronIngredients: IIngredient[],
  reactions: IReaction[] = REACTIONS,
): IMeasurements {
  const base = cauldronIngredients.reduce(
    (total, ingredient) => ({
      temperature: total.temperature + ingredient.temperature,
      density: total.density + ingredient.density,
      magicPower: total.magicPower + ingredient.magicPower,
    }),
    { temperature: 0, density: 0, magicPower: 0 },
  );

  const { temperature, density, magicPower } = reactions
    .filter((reaction) => reaction.isActive(cauldronIngredients))
    .reduce((values, reaction) => reaction.apply(values), base);

  return {
    temperature: Math.round(temperature),
    density: Math.round(density),
    magicPower: Math.round(magicPower),
  };
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
