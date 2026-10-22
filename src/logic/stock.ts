import INGREDIENTS from '../data/ingredients.json';
import { MAX_STOCK, MIN_STOCK } from '../shared/constants';
import { gameState, getSettings } from '../state/game-state';

function getRandomStock() {
  return Math.floor(Math.random() * (MAX_STOCK - MIN_STOCK + 1)) + MIN_STOCK;
}

export function populateShelf() {
  const shelfStock: Record<string, number> = {};

  INGREDIENTS.slice(0, getSettings().shelfSize).forEach(({ id }) => {
    shelfStock[id] = getRandomStock();
  });

  gameState.set({ shelfStock });
}
