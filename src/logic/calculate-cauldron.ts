import type { IIngredient, IMeasurements, IReaction, IRecipeRange } from '../shared/types';
import INGREDIENTS from '../data/ingredients.json';
import { gameState, getSettings } from '../state/game-state';
import { applyReactionEffects, getFiredReactions } from './reactions';

export function isInRange(value: number, { min, max }: IRecipeRange) {
  return value >= min && value <= max;
}

export function getIngredientById(id: string) {
  return (INGREDIENTS as IIngredient[]).find((ingredient) => ingredient.id === id);
}

export function getMeasurements(
  cauldronIngredients: IIngredient[],
  reactions: IReaction[],
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
  const { status, shelfStock, cauldronIngredients, reactionIds } = gameState.get();
  if (status !== 'playing') return;

  const ingredient = getIngredientById(ingredientId);
  const stock = shelfStock[ingredientId] ?? 0;

  if (!ingredient || stock <= 0) return;
  if (cauldronIngredients.length >= getSettings().maxCauldron) return;

  const after = [...cauldronIngredients, ingredient];
  const fired = getFiredReactions(cauldronIngredients, after, reactionIds);

  gameState.set({
    shelfStock: { ...shelfStock, [ingredientId]: stock - 1 },
    cauldronIngredients: after,
  });

  fired.forEach(applyReactionEffects);
}
