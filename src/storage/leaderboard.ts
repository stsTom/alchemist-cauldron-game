import type { Difficulty, ILeaderboardEntry } from '../shared/types';
import {
  DEFAULT_DIFFICULTY,
  DIFFICULTIES,
  LEADERBOARD_KEY,
  LEADERBOARD_SIZE,
} from '../shared/constants';

function isEntry(value: unknown): value is ILeaderboardEntry {
  const entry = value as ILeaderboardEntry;
  return (
    typeof entry === 'object' &&
    entry !== null &&
    typeof entry.name === 'string' &&
    typeof entry.score === 'number' &&
    typeof entry.date === 'number'
  );
}

function loadAllEntries(): ILeaderboardEntry[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) ?? '[]');
    return Array.isArray(data)
      ? data
          .filter(isEntry)
          .map((entry) => ({ ...entry, difficulty: entry.difficulty ?? DEFAULT_DIFFICULTY }))
      : [];
  } catch {
    return [];
  }
}

function getTopEntries(entries: ILeaderboardEntry[], difficulty: Difficulty) {
  return entries
    .filter((entry) => entry.difficulty === difficulty)
    .sort((a, b) => b.score - a.score || a.date - b.date)
    .slice(0, LEADERBOARD_SIZE);
}

export function loadLeaderboard(difficulty: Difficulty) {
  return getTopEntries(loadAllEntries(), difficulty);
}

export function clearLeaderboard() {
  try {
    localStorage.removeItem(LEADERBOARD_KEY);
  } catch {
    // storage unavailable: nothing to clear
  }
}

export function isTopScore(score: number, difficulty: Difficulty) {
  const leaderboard = loadLeaderboard(difficulty);
  return leaderboard.length < LEADERBOARD_SIZE || score > leaderboard[LEADERBOARD_SIZE - 1].score;
}

export function addScore(name: string, score: number, difficulty: Difficulty) {
  const entries = [...loadAllEntries(), { name, score, difficulty, date: Date.now() }];
  const leaderboard = DIFFICULTIES.flatMap((level) => getTopEntries(entries, level));

  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch {
    // storage unavailable or full: keep playing without saving
  }
}
