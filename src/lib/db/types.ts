// Database-agnostic types
// These types are independent of any specific database implementation

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameStats {
  userId: string;
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  bestStreak: number;
  visualGames: number;
  typingGames: number;
  reverseGames: number;
  accuracyRate: number;
  avgTimePerFlag: number;
  flagsMastered: number;
  updatedAt: Date;
}

export interface FlagProgress {
  userId: string;
  countryCode: string;
  timesSeen: number;
  timesCorrect: number;
  lastSeen: Date;
  bestTime?: number; // milliseconds
  masteryLevel: number; // 0-100
}

export interface GameSession {
  id: string;
  userId: string;
  mode: "visual" | "typing" | "reverse";
  region: string;
  questionCount: number;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeElapsed: number; // seconds
  flagsSeen: string[]; // country codes
  createdAt: Date;
}

// Stats for a specific region
export interface RegionStats {
  userId: string;
  region: string;
  gamesPlayed: number;
  totalScore: number;
  bestScore: number;
  accuracyRate: number;
  flagsMastered: number;
  lastPlayed: Date;
}
