import type { ILeaderboardEntry } from '../shared/types';
import { LEADERBOARD_KEY, LEADERBOARD_SIZE } from '../shared/constants';

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

export function loadLeaderboard(): ILeaderboardEntry[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) ?? '[]');
    return Array.isArray(data) ? data.filter(isEntry) : [];
  } catch {
    return [];
  }
}

export function isTopScore(score: number) {
  const leaderboard = loadLeaderboard();
  return leaderboard.length < LEADERBOARD_SIZE || score > leaderboard[LEADERBOARD_SIZE - 1].score;
}

export function addScore(name: string, score: number) {
  const leaderboard = [...loadLeaderboard(), { name, score, date: Date.now() }]
    .sort((a, b) => b.score - a.score || a.date - b.date)
    .slice(0, LEADERBOARD_SIZE);

  try {
    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch {
    // storage unavailable or full: keep playing without saving
  }
}
