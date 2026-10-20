import INGREDIENTS from '../data/ingredients.json';
import { MAX_STOCK, MIN_STOCK, SHELF_VOLUME } from '../shared/constants';
import { gameState } from '../state/game-state';

export function populateShelf() {
  const shelfStock: Record<string, number> = {};

  for (let index = 0; index < SHELF_VOLUME; index++) {
    const ingredientId = INGREDIENTS[Math.round(Math.random() * (INGREDIENTS.length - 1))].id;
    const stock = Math.round(Math.random() * (MAX_STOCK - MIN_STOCK) + MIN_STOCK);

    shelfStock[ingredientId] = (shelfStock[ingredientId] ?? 0) + stock;
  }

  gameState.set({ shelfStock });
}
