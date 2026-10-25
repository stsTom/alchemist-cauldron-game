import type { IIngredient, IMeasurements, IReaction } from '../shared/types';

function has(ingredients: IIngredient[], ...ids: string[]) {
  return ids.every((id) => ingredients.some((ingredient) => ingredient.id === id));
}

function sum(ingredients: IIngredient[], key: keyof IMeasurements) {
  return ingredients.reduce((total, ingredient) => total + ingredient[key], 0);
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
  {
    id: 'annihilation',
    name: 'Annihilation',
    description:
      'One ingredient Temperature > +15 and another < −15 → Temperature set to 0, Density ×2',
    isActive: (ingredients) =>
      ingredients.some(({ temperature }) => temperature > 15) &&
      ingredients.some(({ temperature }) => temperature < -15),
    apply: (values) => ({ ...values, temperature: 0, density: values.density * 2 }),
  },
  {
    id: 'pressure-spike',
    name: 'Pressure Spike',
    description: 'Total Density >= 70 → Density set to 70, Magic Power +10%',
    isActive: (ingredients) => sum(ingredients, 'density') >= 70,
    apply: (values) => ({ ...values, density: 70, magicPower: values.magicPower * 1.1 }),
  },
  {
    id: 'magma-flux',
    name: 'Magma Flux',
    description: 'Total Temperature >= 60 → Magic Power +20%, Density −10%',
    isActive: (ingredients) => sum(ingredients, 'temperature') >= 60,
    apply: (values) => ({
      ...values,
      magicPower: values.magicPower * 1.2,
      density: values.density * 0.9,
    }),
  },
  {
    id: 'deep-freeze',
    name: 'Deep Freeze',
    description: 'Total Temperature <= −20 → Density +15%, Magic Power −15%',
    isActive: (ingredients) => sum(ingredients, 'temperature') <= -20,
    apply: (values) => ({
      ...values,
      density: values.density * 1.15,
      magicPower: values.magicPower * 0.85,
    }),
  },
  {
    id: 'arcane-saturation',
    name: 'Arcane Saturation',
    description: 'Total Magic Power >= 80 → Magic Power set to 80, Temperature +5',
    isActive: (ingredients) => sum(ingredients, 'magicPower') >= 80,
    apply: (values) => ({ ...values, magicPower: 80, temperature: values.temperature + 5 }),
  },
  {
    id: 'steam-burst',
    name: 'Steam Burst',
    description:
      'Dragon Tears + Caustic Acid, Temperature >= 35 → Temperature +10, −5 seconds once',
    timePenalty: 5,
    isActive: (ingredients) =>
      has(ingredients, 'dragon-tears', 'caustic-acid') && sum(ingredients, 'temperature') >= 35,
    apply: (values) => ({ ...values, temperature: values.temperature + 10 }),
  },
  {
    id: 'black-ice',
    name: 'Black Ice',
    description:
      'Frost Lotus + Essence of the Void, Density <= 0 → Temperature −10, Magic Power +20%',
    isActive: (ingredients) =>
      has(ingredients, 'frost-lotus', 'essence-of-the-void') && sum(ingredients, 'density') <= 0,
    apply: (values) => ({
      ...values,
      temperature: values.temperature - 10,
      magicPower: values.magicPower * 1.2,
    }),
  },
  {
    id: 'heavy-spark',
    name: 'Heavy Spark',
    description: 'Fairy Dust + Toad Slime, Density >= 40 → Density +20%, Magic Power +10%',
    isActive: (ingredients) =>
      has(ingredients, 'fairy-dust', 'toad-slime') && sum(ingredients, 'density') >= 40,
    apply: (values) => ({
      ...values,
      density: values.density * 1.2,
      magicPower: values.magicPower * 1.1,
    }),
  },
  {
    id: 'burning-root',
    name: 'Burning Root',
    description:
      'Mandrake Root + Phoenix Feather, Temperature >= 40 → Temperature +15, Density −10%',
    isActive: (ingredients) =>
      has(ingredients, 'mandrake-root', 'phoenix-feather') && sum(ingredients, 'temperature') >= 40,
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 15,
      density: values.density * 0.9,
    }),
  },
  {
    id: 'void-resonance',
    name: 'Void Resonance',
    description:
      'Essence of the Void + Dragon Tears, Magic Power >= 50 → Magic Power +30%, Temperature −5',
    isActive: (ingredients) =>
      has(ingredients, 'essence-of-the-void', 'dragon-tears') &&
      sum(ingredients, 'magicPower') >= 50,
    apply: (values) => ({
      ...values,
      magicPower: values.magicPower * 1.3,
      temperature: values.temperature - 5,
    }),
  },
];
