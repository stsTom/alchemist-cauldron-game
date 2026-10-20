import type { Difficulty, IGameState, IIngredient, IRecipe, IRecipeRange } from './shared/types';
import DIFFICULTY_SETTINGS from './data/difficulty.json';
import INGREDIENTS from './data/ingredients.json';
import RECIPES from './data/recipes.json';
import { createGameState } from './state/game-state';

interface IMeasurements {
  temperature: number;
  density: number;
  magicPower: number;
}

const gamePage = document.querySelector('main');

const CHOSEN_DIFFICULTY = 'medium' as Difficulty;

const MAX_LIVES = DIFFICULTY_SETTINGS['lives'][CHOSEN_DIFFICULTY];
const SHELF_VOLUME = DIFFICULTY_SETTINGS['ingredients-on-shelf'][CHOSEN_DIFFICULTY];
const MAX_CAULDRON_INGREDIENTS =
  DIFFICULTY_SETTINGS['max-ingredients-in-cauldron'][CHOSEN_DIFFICULTY];
const { min: MIN_STOCK, max: MAX_STOCK }: IRecipeRange = { min: 2, max: 15 };

//state: game
const gameState = createGameState({
  status: 'playing',
  score: 0,
  timeLeft: 0,
  lives: MAX_LIVES,
  activeRecipe: getRandomRecipe(),
  cauldronIngredients: [],
  shelfStock: {},
  difficulty: CHOSEN_DIFFICULTY,
});

function getIngredientById(id: string) {
  return (INGREDIENTS as IIngredient[]).find((ingredient) => ingredient.id === id);
}

function getMeasurements(cauldronIngredients: IIngredient[]): IMeasurements {
  return cauldronIngredients.reduce(
    (total, ingredient) => ({
      temperature: total.temperature + ingredient.temperature,
      density: total.density + ingredient.density,
      magicPower: total.magicPower + ingredient.magicPower,
    }),
    { temperature: 0, density: 0, magicPower: 0 },
  );
}

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

function renderMeasurements({ activeRecipe, cauldronIngredients }: IGameState) {
  const { temperature, density, magicPower } = activeRecipe;
  const measurements = getMeasurements(cauldronIngredients);

  temperatureUi.textContent = `min: ${temperature.min}; max: ${temperature.max}; current: ${measurements.temperature}`;
  densityUi.textContent = `min: ${density.min}; max: ${density.max}; current: ${measurements.density}`;
  magicPowerUi.textContent = `min: ${magicPower.min}; max: ${magicPower.max}; current: ${measurements.magicPower}`;
}

function renderShelf({ shelfStock }: IGameState) {
  const buttons = Object.entries(shelfStock).map(([id, stock]) => {
    const ingredient = getIngredientById(id);
    const ingredientUi = document.createElement('button');

    if (!ingredient) return ingredientUi;

    ingredientUi.textContent = `${ingredient.name} ${stock}`;
    ingredientUi.disabled = stock <= 0;
    ingredientUi.addEventListener('click', () => addToCauldron(id));

    const characteristics = document.createElement('p');
    characteristics.textContent = `T: ${ingredient.temperature}, D: ${ingredient.density}, M: ${ingredient.magicPower}`;
    ingredientUi.append(characteristics);

    return ingredientUi;
  });

  shelfSection.replaceChildren(...buttons);
}

const cauldronUi = document.createElement('div');
cauldronUi.classList.add('cauldron');

function renderCauldron({ cauldronIngredients }: IGameState) {
  cauldronUi.textContent = `Cauldron: ${cauldronIngredients.length} / ${MAX_CAULDRON_INGREDIENTS}`;
}

const healthUi = document.createElement('div');
healthUi.classList.add('health');

function renderHealth({ lives }: IGameState) {
  healthUi.textContent = `Lives: ${lives} / ${MAX_LIVES}`;
}

function render(state: IGameState) {
  renderShelf(state);
  renderMeasurements(state);
  renderCauldron(state);
  renderHealth(state);
}

gameState.subscribe(render);
render(gameState.get());

const statusUi = document.createElement('div');
statusUi.classList.add('status');

const brewButton = document.createElement('button');
brewButton.classList.add('brew-button');
brewButton.textContent = 'Brew';
brewButton.addEventListener('click', handleBrew);

//recipe-generator part
function getRandomRecipe() {
  const recipeUi = document.createElement('span');
  recipeUi.classList.add('current-recipe');

  const recipe = RECIPES[CHOSEN_DIFFICULTY][
    Math.round(Math.random() * (RECIPES[CHOSEN_DIFFICULTY].length - 1))
  ] as IRecipe;

  recipeUi.textContent = recipe.name;

  return recipe;
}
// end of recipe generator

// calculate-cauldron.ts part
function addToCauldron(ingredientId: string) {
  const { shelfStock, cauldronIngredients } = gameState.get();
  const ingredient = getIngredientById(ingredientId);
  const stock = shelfStock[ingredientId] ?? 0;

  if (!ingredient || stock <= 0) return;
  if (cauldronIngredients.length >= MAX_CAULDRON_INGREDIENTS) return;

  gameState.set({
    shelfStock: { ...shelfStock, [ingredientId]: stock - 1 },
    cauldronIngredients: [...cauldronIngredients, ingredient],
  });
}
//end of calculate-cauldron part

//brew-check part
function isInRange(value: number, { min, max }: IRecipeRange) {
  return value >= min && value <= max;
}

function handleBrew() {
  const { activeRecipe, cauldronIngredients, shelfStock } = gameState.get();
  const { temperature, density, magicPower } = getMeasurements(cauldronIngredients);

  const isSuccess =
    isInRange(temperature, activeRecipe.temperature) &&
    isInRange(density, activeRecipe.density) &&
    isInRange(magicPower, activeRecipe.magicPower);

  let { lives } = gameState.get();

  if (!isSuccess) {
    lives -= 1;
    gameState.set({ lives });
  }

  const isShelfEmpty = Object.values(shelfStock).every((stock) => stock <= 0);

  if (lives > 0 && !isShelfEmpty) {
    resetRound();
    return;
  }

  gameState.set({ status: 'game-over' });
  brewButton.disabled = true;
  statusUi.textContent = lives > 0 ? 'Out of ingredients. Game over' : 'No lives left. Game over';
}
// end of brew-check part

//stock generation part (stock.ts)
function populateShelf() {
  const shelfStock: Record<string, number> = {};

  for (let index = 0; index < SHELF_VOLUME; index++) {
    const ingredientId = INGREDIENTS[Math.round(Math.random() * (INGREDIENTS.length - 1))].id;
    const stock = Math.round(Math.random() * (MAX_STOCK - MIN_STOCK) + MIN_STOCK);

    shelfStock[ingredientId] = (shelfStock[ingredientId] ?? 0) + stock;
  }

  gameState.set({ shelfStock });
}
//end of stock generation part (stock.ts - does this component need decreasing stock logic)

function resetRound() {
  gameState.set({ activeRecipe: getRandomRecipe(), cauldronIngredients: [] });
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
