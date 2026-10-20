import { createStore } from '../shared/store';
import type { IGameState } from '../shared/types';

export function createGameState(initial: IGameState) {
  return createStore<IGameState>(initial);
}
