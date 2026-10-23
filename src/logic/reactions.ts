import { REACTIONS } from '../data/reactions';

export function pickReactionIds(count: number) {
  return [...REACTIONS]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(({ id }) => id);
}

export function getReactionsByIds(ids: string[]) {
  return REACTIONS.filter(({ id }) => ids.includes(id));
}
