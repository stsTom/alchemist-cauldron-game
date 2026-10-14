import type { Difficulty, IIngredient, IRecipe, IRecipeRange } from './shared/types';
import DIFFICULTY_SETTINGS from './data/difficulty.json';
import INGREDIENTS from './data/ingredients.json';
import RECIPES from './data/recipes.json';
import { createStore } from './shared/store';

interface IMeasurements {
  temperature: number;
  density: number;
  magicPower: number;
}

interface IShelfIngredient extends IIngredient {
  stock: number;
}

const gamePage = document.querySelector('main');

interface IShelf {
  ingredients: IShelfIngredient[];
}

const shelf = createStore<IShelf>({ ingredients: [] });

const CHOSEN_DIFFICULTY = 'medium' as Difficulty;

const MAX_LIVES = DIFFICULTY_SETTINGS['lives'][CHOSEN_DIFFICULTY];
const SHELF_VOLUME = DIFFICULTY_SETTINGS['ingredients-on-shelf'][CHOSEN_DIFFICULTY];
const MAX_CAULDRON_INGREDIENTS =
  DIFFICULTY_SETTINGS['max-ingredients-in-cauldron'][CHOSEN_DIFFICULTY];
const { min: MIN_STOCK, max: MAX_STOCK }: IRecipeRange = { min: 2, max: 15 };

const shelfSection = document.createElement('section');
shelfSection.classList.add('shelf');

const recipeSeciton = document.createElement('section');
recipeSeciton.classList.add('recipeSeciton');

const measurementsSection = document.createElement('section');
measurementsSection.classList.add('measurements-section');

const temperatureUi = document.createElement('div');
const densityUi = document.createElement('div');
const magicPowerUi = document.createElement('div');
measurementsSection.append(temperatureUi, densityUi, magicPowerUi);

let currentRecipe: IRecipe;

const currentMeasurments = createStore<IMeasurements>({
  temperature: 0,
  density: 0,
  magicPower: 0,
});

function renderMeasurements(measurements: IMeasurements) {
  if (!currentRecipe) return;

  const { temperature, density, magicPower } = currentRecipe;

  temperatureUi.textContent = `min: ${temperature.min}; max: ${temperature.max}; current: ${measurements.temperature}`;
  densityUi.textContent = `min: ${density.min}; max: ${density.max}; current: ${measurements.density}`;
  magicPowerUi.textContent = `min: ${magicPower.min}; max: ${magicPower.max}; current: ${measurements.magicPower}`;
}

currentMeasurments.subscribe(renderMeasurements);

function renderShelf({ ingredients }: IShelf) {
  const buttons = ingredients.map((ingredient, index) => {
    const ingredientUi = document.createElement('button');

    ingredientUi.textContent = `${ingredient.name} ${ingredient.stock}`;
    ingredientUi.disabled = ingredient.stock <= 0;
    ingredientUi.addEventListener('click', () => addToCauldron(index));

    return ingredientUi;
  });

  shelfSection.replaceChildren(...buttons);
}

shelf.subscribe(renderShelf);

interface ICauldron {
  ingredientsCount: number;
}

const cauldron = createStore<ICauldron>({ ingredientsCount: 0 });

const cauldronUi = document.createElement('div');
cauldronUi.classList.add('cauldron');

function renderCauldron({ ingredientsCount }: ICauldron) {
  cauldronUi.textContent = `Cauldron: ${ingredientsCount} / ${MAX_CAULDRON_INGREDIENTS}`;
}

cauldron.subscribe(renderCauldron);
renderCauldron(cauldron.get());

interface IHealth {
  lives: number;
}

const health = createStore<IHealth>({ lives: MAX_LIVES });

const healthUi = document.createElement('div');
healthUi.classList.add('health');

function renderHealth({ lives }: IHealth) {
  healthUi.textContent = `Lives: ${lives} / ${MAX_LIVES}`;
}

health.subscribe(renderHealth);
renderHealth(health.get());

const statusUi = document.createElement('div');
statusUi.classList.add('status');

const brewButton = document.createElement('button');
brewButton.classList.add('brew-button');
brewButton.textContent = 'Brew';
brewButton.addEventListener('click', handleBrew);

function getRandomRecipe() {
  const recipeUi = document.createElement('span');
  recipeUi.classList.add('current-recipe');

  const recipe = RECIPES[CHOSEN_DIFFICULTY][
    Math.round(Math.random() * (RECIPES[CHOSEN_DIFFICULTY].length - 1))
  ] as IRecipe;

  recipeUi.textContent = recipe.name;

  return recipe;
}

function addToCauldron(shelfIndex: number) {
  const { ingredients } = shelf.get();
  const ingredient = ingredients[shelfIndex];

  const { ingredientsCount } = cauldron.get();

  if (!ingredient || ingredient.stock <= 0) return;
  if (ingredientsCount >= MAX_CAULDRON_INGREDIENTS) return;

  cauldron.set({ ingredientsCount: ingredientsCount + 1 });

  shelf.set({
    ingredients: ingredients.map((item, index) =>
      index === shelfIndex ? { ...item, stock: item.stock - 1 } : item,
    ),
  });

  const { temperature, density, magicPower } = currentMeasurments.get();

  currentMeasurments.set({
    temperature: temperature + ingredient.temperature,
    density: density + ingredient.density,
    magicPower: magicPower + ingredient.magicPower,
  });
}

function isInRange(value: number, { min, max }: IRecipeRange) {
  return value >= min && value <= max;
}

function handleBrew() {
  const { temperature, density, magicPower } = currentMeasurments.get();

  const isSuccess =
    isInRange(temperature, currentRecipe.temperature) &&
    isInRange(density, currentRecipe.density) &&
    isInRange(magicPower, currentRecipe.magicPower);

  let { lives } = health.get();

  if (!isSuccess) {
    lives -= 1;
    health.set({ lives });
  }

  const isShelfEmpty = shelf.get().ingredients.every((ingredient) => ingredient.stock <= 0);

  if (lives > 0 && !isShelfEmpty) {
    resetRound();
    return;
  }

  brewButton.disabled = true;
  statusUi.textContent = lives > 0 ? 'Out of ingredients. Game over' : 'No lives left. Game over';
}

function populateShelf() {
  const ingredients: IShelfIngredient[] = [];

  for (let index = 0; index < SHELF_VOLUME; index++) {
    const ingredientId = Math.round(Math.random() * (INGREDIENTS.length - 1));

    ingredients.push({
      ...INGREDIENTS[ingredientId],
      stock: Math.round(Math.random() * (MAX_STOCK - MIN_STOCK) + MIN_STOCK),
    } as IShelfIngredient);
  }

  shelf.set({ ingredients });
}

function resetRound() {
  currentRecipe = getRandomRecipe();
  currentMeasurments.set({ temperature: 0, density: 0, magicPower: 0 });
  cauldron.set({ ingredientsCount: 0 });
}

if (gamePage) {
  gamePage.replaceChildren(
    shelfSection,
    recipeSeciton,
    measurementsSection,
    cauldronUi,
    healthUi,
    brewButton,
    statusUi,
  );
}

function startGame() {
  resetRound();
  populateShelf();
}

startGame();
