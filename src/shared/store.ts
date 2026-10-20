export type Listener<T> = (state: T) => void;

export interface IStore<T> {
  get: () => T;
  set: (patch: Partial<T>) => void;
  subscribe: (listener: Listener<T>) => () => void;
}

export function createStore<T extends object>(initial: T): IStore<T> {
  let state = initial;
  const listeners = new Set<Listener<T>>();

  return {
    get: () => state,

    set(patch) {
      state = { ...state, ...patch };
      listeners.forEach((listener) => listener(state));
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
