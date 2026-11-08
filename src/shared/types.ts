export type Difficulty = 'easy' | 'medium' | 'hard'; // Level 2+
export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';
export type GameOverReason = 'time-up' | 'no-lives' | 'out-of-ingredients';
export type GameMode = 'solo' | 'duel';
export type DuelRole = 'host' | 'guest';
export type DuelPhase = 'code-input' | 'connecting' | 'waiting' | 'joining' | 'ready';

export interface IDuelState {
  role: DuelRole;
  code: string;
  phase: DuelPhase;
  error?: string | null;
}

export interface IIngredient {
  id: string;
  name: string;
  icon: string;
  temperature: number;
  density: number;
  magicPower: number;
}

export interface IRecipeRange {
  min: number;
  max: number;
}

export interface IRecipe {
  id: string;
  name: string;
  difficulty: Difficulty;
  temperature: IRecipeRange;
  density: IRecipeRange;
  magicPower: IRecipeRange;
}

export interface IGameState {
  status: GameStatus;
  score: number;
  timeLeft: number; // ms
  lives: number;
  gameOverReason?: GameOverReason | null;
  activeRecipe: IRecipe | null; // null on the start screen
  cauldronIngredients: IIngredient[];
  shelfStock: Record<string, number>; // ingredient id -> portions left
  isHelpOpen?: boolean;
  isLeaderboardOpen?: boolean;
  isClearConfirmOpen?: boolean;
  isScoreSubmitted?: boolean;
  isSettingsOpen?: boolean;
  difficulty: Difficulty;
  reactionIds: string[]; // enabled for the current round
  lastReactionId?: string | null; // Level 3+
  mode: GameMode;
  duel: IDuelState | null;
  duelNotice?: string | null;
}

export type ISavedGame = Pick<
  IGameState,
  | 'difficulty'
  | 'score'
  | 'timeLeft'
  | 'lives'
  | 'activeRecipe'
  | 'cauldronIngredients'
  | 'shelfStock'
  | 'reactionIds'
  | 'status'
>;

export interface ILeaderboardEntry {
  name: string;
  score: number;
  difficulty: Difficulty;
  date: number; // ms timestamp
}

export interface IMeasurements {
  temperature: number;
  density: number;
  magicPower: number;
}

export type DuelMessage =
  | { type: 'create' }
  | { type: 'created'; code: string }
  | { type: 'join'; code: string }
  | { type: 'opponent-joined' }
  | { type: 'error'; reason: 'room-unavailable' }
  | { type: 'opponent-left' }
  | { type: 'start'; difficulty: Difficulty; countdownMs: number }
  | { type: 'progress'; score: number; lives: number }
  | { type: 'finished'; score: number; reason: GameOverReason }
  | { type: 'rematch' };

export interface IReaction {
  id: string;
  name: string;
  description: string;
  timePenalty?: number; // seconds
  lifePenalty?: number;
  clearsCauldron?: boolean;
  isActive: (ingredients: IIngredient[]) => boolean;
  apply: (values: IMeasurements) => IMeasurements;
}
