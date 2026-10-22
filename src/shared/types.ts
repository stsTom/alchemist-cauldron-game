export type Difficulty = 'easy' | 'medium' | 'hard'; // Level 2+
export type GameStatus = 'menu' | 'playing' | 'paused' | 'game-over';
export type GameOverReason = 'time-up' | 'no-lives' | 'out-of-ingredients';

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
  difficulty?: Difficulty; // Level 2+
  lastReactionId?: string | null; // Level 3+
}

export interface ILeaderboardEntry {
  name: string;
  score: number;
  date: number; // ms timestamp
}

export interface IReaction {
  id: string;
  name: string;
  difficulty: Exclude<Difficulty, 'easy'>;
  isActive: (ingredients: IIngredient[]) => boolean;
  apply: (values: { temperature: number; density: number; magicPower: number }) => {
    temperature: number;
    density: number;
    magicPower: number;
  };
}
