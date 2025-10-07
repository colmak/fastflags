// Database abstraction layer interface
// This interface ensures we can swap database providers without changing application code

import type {
  User,
  GameStats,
  FlagProgress,
  GameSession,
  RegionStats,
} from "./types";

export interface DatabaseAdapter {
  // User operations
  getUser(userId: string): Promise<User | null>;
  createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User>;
  updateUser(userId: string, data: Partial<User>): Promise<User>;

  // Game stats operations
  getGameStats(userId: string): Promise<GameStats | null>;
  updateGameStats(userId: string, stats: Partial<GameStats>): Promise<GameStats>;
  incrementGameStats(
    userId: string,
    updates: {
      gamesPlayed?: number;
      totalScore?: number;
      visualGames?: number;
      typingGames?: number;
      reverseGames?: number;
    }
  ): Promise<GameStats>;

  // Flag progress operations
  getFlagProgress(userId: string, countryCode: string): Promise<FlagProgress | null>;
  getAllFlagProgress(userId: string): Promise<FlagProgress[]>;
  updateFlagProgress(
    userId: string,
    countryCode: string,
    progress: Partial<FlagProgress>
  ): Promise<FlagProgress>;
  incrementFlagProgress(
    userId: string,
    countryCode: string,
    updates: {
      timesSeen?: number;
      timesCorrect?: number;
      bestTime?: number;
    }
  ): Promise<FlagProgress>;

  // Game session operations
  createGameSession(session: Omit<GameSession, "id" | "createdAt">): Promise<GameSession>;
  getGameSessions(userId: string, limit?: number): Promise<GameSession[]>;
  getUserGameHistory(userId: string, options?: {
    mode?: "visual" | "typing" | "reverse";
    region?: string;
    limit?: number;
  }): Promise<GameSession[]>;

  // Region stats operations
  getRegionStats(userId: string, region: string): Promise<RegionStats | null>;
  getAllRegionStats(userId: string): Promise<RegionStats[]>;
  updateRegionStats(
    userId: string,
    region: string,
    stats: Partial<RegionStats>
  ): Promise<RegionStats>;

  // Leaderboard operations (future)
  getTopPlayers(limit: number): Promise<Array<{ userId: string; score: number; rank: number }>>;
  getUserRank(userId: string): Promise<number>;
}
