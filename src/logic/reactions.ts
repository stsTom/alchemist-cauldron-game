import type { IIngredient, IReaction } from '../shared/types';
import { REACTIONS } from '../data/reactions';
import { gameState } from '../state/game-state';
import { endGame, removeTime } from './timer';

export function pickReactionIds(count: number) {
  return [...REACTIONS]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(({ id }) => id);
}

export function getReactionsByIds(ids: string[]) {
  return REACTIONS.filter(({ id }) => ids.includes(id));
}

export function getFiredReactions(before: IIngredient[], after: IIngredient[], ids: string[]) {
  return getReactionsByIds(ids).filter((reaction) => {
    return !reaction.isActive(before) && reaction.isActive(after);
  });
}

export function applyReactionEffects({ timePenalty, lifePenalty, clearsCauldron }: IReaction) {
  if (gameState.get().status !== 'playing') return;

  if (clearsCauldron) gameState.set({ cauldronIngredients: [] });

  if (lifePenalty) {
    const lives = gameState.get().lives - lifePenalty;
    gameState.set({ lives });
    if (lives <= 0) {
      endGame('no-lives');
      return;
    }
  }

  if (timePenalty) removeTime(timePenalty * 1000);
}
