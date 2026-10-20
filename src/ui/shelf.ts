import type { IGameState } from '../shared/types';
import { addToCauldron, getIngredientById } from '../logic/calculate-cauldron';

export const shelfSection = document.createElement('section');
shelfSection.classList.add('shelf');

export function renderShelf({ shelfStock }: IGameState) {
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
