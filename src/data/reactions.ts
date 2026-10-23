import type { IIngredient, IReaction } from '../shared/types';

function has(ingredients: IIngredient[], ...ids: string[]) {
  return ids.every((id) => ingredients.some((ingredient) => ingredient.id === id));
}

export const REACTIONS: IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    description: 'Fairy Dust + Caustic Acid → Magic Power +50%, −10 seconds once',
    timePenalty: 10,
    isActive: (ingredients) => has(ingredients, 'fairy-dust', 'caustic-acid'),
    apply: (values) => ({ ...values, magicPower: values.magicPower * 1.5 }),
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    description: 'Phoenix Feather + Essence of the Void → lose 1 life and clear the cauldron',
    lifePenalty: 1,
    clearsCauldron: true,
    isActive: (ingredients) => has(ingredients, 'phoenix-feather', 'essence-of-the-void'),
    apply: (values) => values,
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    description: 'Dragon Tears + Frost Lotus → Temperature set to 0, Density +20%',
    isActive: (ingredients) => has(ingredients, 'dragon-tears', 'frost-lotus'),
    apply: (values) => ({ ...values, temperature: 0, density: values.density * 1.2 }),
  },
  {
    id: 'rooted-steam',
    name: 'Rooted Steam',
    description: 'Mandrake Root + Toad Slime → Density +25%, Magic Power −10%',
    isActive: (ingredients) => has(ingredients, 'mandrake-root', 'toad-slime'),
    apply: (values) => ({
      ...values,
      density: values.density * 1.25,
      magicPower: values.magicPower * 0.9,
    }),
  },
  {
    id: 'ashen-bloom',
    name: 'Ashen Bloom',
    description: 'Phoenix Feather + Fairy Dust → Temperature +10, Magic Power +25%',
    isActive: (ingredients) => has(ingredients, 'phoenix-feather', 'fairy-dust'),
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 10,
      magicPower: values.magicPower * 1.25,
    }),
  },
];
