import seedrandom from 'seedrandom';

let current: () => number = Math.random;

export function rng() {
  return current();
}

export function setSeed(seed: string | null) {
  current = seed === null ? Math.random : seedrandom(seed);
}
