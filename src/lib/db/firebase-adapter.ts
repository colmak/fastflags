// Firebase Firestore implementation of DatabaseAdapter
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  increment,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import type { DatabaseAdapter } from "./interface";
import type {
  User,
  GameStats,
  FlagProgress,
  GameSession,
  RegionStats,
} from "./types";

export class FirebaseAdapter implements DatabaseAdapter {
  constructor(private db: Firestore) {}

  // Helper to convert Firestore timestamps to Date
  private toDate(timestamp: any): Date {
    if (timestamp?.toDate) return timestamp.toDate();
    if (timestamp instanceof Date) return timestamp;
    return new Date(timestamp);
  }

  // User operations
  async getUser(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(this.db, "users", userId));
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    return {
      id: userDoc.id,
      email: data.email,
      name: data.name,
      image: data.image,
      createdAt: this.toDate(data.createdAt),
      updatedAt: this.toDate(data.updatedAt),
    };
  }

  async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const userRef = doc(collection(this.db, "users"));
    const now = new Date();

    const user: User = {
      id: userRef.id,
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(userRef, {
      ...userData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return user;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<User> {
    const userRef = doc(this.db, "users", userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });

    const updated = await this.getUser(userId);
    if (!updated) throw new Error("User not found after update");
    return updated;
  }

  // Game stats operations
  async getGameStats(userId: string): Promise<GameStats | null> {
    const statsDoc = await getDoc(doc(this.db, "gameStats", userId));
    if (!statsDoc.exists()) return null;

    const data = statsDoc.data();
    return {
      userId,
      gamesPlayed: data.gamesPlayed || 0,
      totalScore: data.totalScore || 0,
      bestScore: data.bestScore || 0,
      bestStreak: data.bestStreak || 0,
      visualGames: data.visualGames || 0,
      typingGames: data.typingGames || 0,
      reverseGames: data.reverseGames || 0,
      accuracyRate: data.accuracyRate || 0,
      avgTimePerFlag: data.avgTimePerFlag || 0,
      flagsMastered: data.flagsMastered || 0,
      updatedAt: this.toDate(data.updatedAt),
    };
  }

  async updateGameStats(userId: string, stats: Partial<GameStats>): Promise<GameStats> {
    const statsRef = doc(this.db, "gameStats", userId);
    await setDoc(
      statsRef,
      {
        ...stats,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const updated = await this.getGameStats(userId);
    if (!updated) throw new Error("Stats not found after update");
    return updated;
  }

  async incrementGameStats(
    userId: string,
    updates: {
      gamesPlayed?: number;
      totalScore?: number;
      visualGames?: number;
      typingGames?: number;
      reverseGames?: number;
    }
  ): Promise<GameStats> {
    const statsRef = doc(this.db, "gameStats", userId);
    const incrementUpdates: Record<string, any> = {
      updatedAt: serverTimestamp(),
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        incrementUpdates[key] = increment(value);
      }
    });

    await setDoc(statsRef, incrementUpdates, { merge: true });

    const updated = await this.getGameStats(userId);
    if (!updated) throw new Error("Stats not found after increment");
    return updated;
  }

  // Flag progress operations
  async getFlagProgress(userId: string, countryCode: string): Promise<FlagProgress | null> {
    const progressId = `${userId}_${countryCode}`;
    const progressDoc = await getDoc(doc(this.db, "flagProgress", progressId));
    if (!progressDoc.exists()) return null;

    const data = progressDoc.data();
    return {
      userId,
      countryCode,
      timesSeen: data.timesSeen || 0,
      timesCorrect: data.timesCorrect || 0,
      lastSeen: this.toDate(data.lastSeen),
      bestTime: data.bestTime,
      masteryLevel: data.masteryLevel || 0,
    };
  }

  async getAllFlagProgress(userId: string): Promise<FlagProgress[]> {
    const q = query(
      collection(this.db, "flagProgress"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        userId: data.userId,
        countryCode: data.countryCode,
        timesSeen: data.timesSeen || 0,
        timesCorrect: data.timesCorrect || 0,
        lastSeen: this.toDate(data.lastSeen),
        bestTime: data.bestTime,
        masteryLevel: data.masteryLevel || 0,
      };
    });
  }

  async updateFlagProgress(
    userId: string,
    countryCode: string,
    progress: Partial<FlagProgress>
  ): Promise<FlagProgress> {
    const progressId = `${userId}_${countryCode}`;
    const progressRef = doc(this.db, "flagProgress", progressId);

    await setDoc(
      progressRef,
      {
        userId,
        countryCode,
        ...progress,
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    const updated = await this.getFlagProgress(userId, countryCode);
    if (!updated) throw new Error("Progress not found after update");
    return updated;
  }

  async incrementFlagProgress(
    userId: string,
    countryCode: string,
    updates: {
      timesSeen?: number;
      timesCorrect?: number;
      bestTime?: number;
    }
  ): Promise<FlagProgress> {
    const progressId = `${userId}_${countryCode}`;
    const progressRef = doc(this.db, "flagProgress", progressId);

    const incrementUpdates: Record<string, any> = {
      userId,
      countryCode,
      lastSeen: serverTimestamp(),
    };

    if (updates.timesSeen !== undefined) {
      incrementUpdates.timesSeen = increment(updates.timesSeen);
    }
    if (updates.timesCorrect !== undefined) {
      incrementUpdates.timesCorrect = increment(updates.timesCorrect);
    }
    if (updates.bestTime !== undefined) {
      // For bestTime, we want the minimum, not increment
      const current = await this.getFlagProgress(userId, countryCode);
      if (!current?.bestTime || updates.bestTime < current.bestTime) {
        incrementUpdates.bestTime = updates.bestTime;
      }
    }

    await setDoc(progressRef, incrementUpdates, { merge: true });

    const updated = await this.getFlagProgress(userId, countryCode);
    if (!updated) throw new Error("Progress not found after increment");
    return updated;
  }

  // Game session operations
  async createGameSession(sessionData: Omit<GameSession, "id" | "createdAt">): Promise<GameSession> {
    const sessionRef = doc(collection(this.db, "gameSessions"));
    const now = new Date();

    const session: GameSession = {
      id: sessionRef.id,
      ...sessionData,
      createdAt: now,
    };

    await setDoc(sessionRef, {
      ...sessionData,
      createdAt: serverTimestamp(),
    });

    return session;
  }

  async getGameSessions(userId: string, limit: number = 10): Promise<GameSession[]> {
    const q = query(
      collection(this.db, "gameSessions"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
      firestoreLimit(limit)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        mode: data.mode,
        region: data.region,
        questionCount: data.questionCount,
        score: data.score,
        totalQuestions: data.totalQuestions,
        accuracy: data.accuracy,
        timeElapsed: data.timeElapsed,
        flagsSeen: data.flagsSeen || [],
        createdAt: this.toDate(data.createdAt),
      };
    });
  }

  async getUserGameHistory(
    userId: string,
    options?: {
      mode?: "visual" | "typing" | "reverse";
      region?: string;
      limit?: number;
    }
  ): Promise<GameSession[]> {
    const constraints = [
      where("userId", "==", userId),
      orderBy("createdAt", "desc"),
    ];

    if (options?.mode) {
      constraints.push(where("mode", "==", options.mode));
    }
    if (options?.region) {
      constraints.push(where("region", "==", options.region));
    }
    if (options?.limit) {
      constraints.push(firestoreLimit(options.limit));
    }

    const q = query(collection(this.db, "gameSessions"), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        mode: data.mode,
        region: data.region,
        questionCount: data.questionCount,
        score: data.score,
        totalQuestions: data.totalQuestions,
        accuracy: data.accuracy,
        timeElapsed: data.timeElapsed,
        flagsSeen: data.flagsSeen || [],
        createdAt: this.toDate(data.createdAt),
      };
    });
  }

  // Region stats operations
  async getRegionStats(userId: string, region: string): Promise<RegionStats | null> {
    const statsId = `${userId}_${region}`;
    const statsDoc = await getDoc(doc(this.db, "regionStats", statsId));
    if (!statsDoc.exists()) return null;

    const data = statsDoc.data();
    return {
      userId,
      region,
      gamesPlayed: data.gamesPlayed || 0,
      totalScore: data.totalScore || 0,
      bestScore: data.bestScore || 0,
      accuracyRate: data.accuracyRate || 0,
      flagsMastered: data.flagsMastered || 0,
      lastPlayed: this.toDate(data.lastPlayed),
    };
  }

  async getAllRegionStats(userId: string): Promise<RegionStats[]> {
    const q = query(
      collection(this.db, "regionStats"),
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        userId: data.userId,
        region: data.region,
        gamesPlayed: data.gamesPlayed || 0,
        totalScore: data.totalScore || 0,
        bestScore: data.bestScore || 0,
        accuracyRate: data.accuracyRate || 0,
        flagsMastered: data.flagsMastered || 0,
        lastPlayed: this.toDate(data.lastPlayed),
      };
    });
  }

  async updateRegionStats(
    userId: string,
    region: string,
    stats: Partial<RegionStats>
  ): Promise<RegionStats> {
    const statsId = `${userId}_${region}`;
    const statsRef = doc(this.db, "regionStats", statsId);

    await setDoc(
      statsRef,
      {
        userId,
        region,
        ...stats,
        lastPlayed: serverTimestamp(),
      },
      { merge: true }
    );

    const updated = await this.getRegionStats(userId, region);
    if (!updated) throw new Error("Region stats not found after update");
    return updated;
  }

  // Leaderboard operations (placeholder for future implementation)
  async getTopPlayers(limit: number): Promise<Array<{ userId: string; score: number; rank: number }>> {
    // TODO: Implement leaderboard functionality
    return [];
  }

  async getUserRank(userId: string): Promise<number> {
    // TODO: Implement user ranking
    return 0;
  }
}
