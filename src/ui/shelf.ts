import type { IGameState } from '../shared/types';
import { getIngredientById } from '../logic/calculate-cauldron';

export const shelfSection = document.createElement('ul');
shelfSection.classList.add('shelf');

let renderedStock: IGameState['shelfStock'] | null = null;

export function renderShelf({ shelfStock }: IGameState) {
  if (shelfStock === renderedStock) return;
  renderedStock = shelfStock;

  const cards = Object.entries(shelfStock).map(([id, stock]) => {
    const ingredient = getIngredientById(id);
    const ingredientUi = document.createElement('li');
    ingredientUi.classList.add('ingredient-card');

    if (!ingredient) return ingredientUi;

    ingredientUi.textContent = `${ingredient.name} ${stock}`;
    ingredientUi.draggable = stock > 0;
    ingredientUi.classList.toggle('empty', stock <= 0);
    // ingredientUi.addEventListener('click', () => addToCauldron(id));
    ingredientUi.addEventListener('dragstart', (event) => {
      if (!event.dataTransfer) return;
      event.dataTransfer.setData('text/plain', id);
      event.dataTransfer.effectAllowed = 'copy';
    });

    const characteristics = document.createElement('p');
    characteristics.textContent = `T: ${ingredient.temperature}, D: ${ingredient.density}, M: ${ingredient.magicPower}`;
    ingredientUi.append(characteristics);

    return ingredientUi;
  });

  shelfSection.replaceChildren(...cards);
}
