"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FloatingFlags } from "@/components/layout/FloatingFlags";
import { Footer } from "@/components/layout/Footer";
import { PracticeGame } from "@/components/game/PracticeGame";
import { PracticeSettings } from "@/components/game/PracticeSettings";
import { GameResults } from "@/components/game/GameResults";

type GameState = "settings" | "playing" | "results";

interface GameSettings {
  timeLimit: number;
  region: string;
  questionCount: number;
}

interface GameStats {
  score: number;
  totalQuestions: number;
  timeElapsed: number;
  accuracy: number;
}

export default function Practice() {
  const [gameState, setGameState] = useState<GameState>("settings");
  const [gameSettings, setGameSettings] = useState<GameSettings>({
    timeLimit: 30,
    region: "all",
    questionCount: 10,
  });
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    totalQuestions: 0,
    timeElapsed: 0,
    accuracy: 0,
  });

  const handleStartGame = (settings: GameSettings) => {
    setGameSettings(settings);
    setGameState("playing");
  };

  const handleEndGame = (stats?: GameStats) => {
    if (stats) {
      setGameStats(stats);
      setGameState("results");
    } else {
      setGameState("settings");
    }
  };

  const handlePlayAgain = () => {
    setGameState("playing");
  };

  const handleBackToSettings = () => {
    setGameState("settings");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <FloatingFlags />
      <Header />

      <main className="relative z-10 container mx-auto px-6 py-8">
        {gameState === "settings" && (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-100 mb-2">
                Practice Mode
              </h1>
              <p className="text-gray-400">
                Improve your flag recognition skills
              </p>
            </div>
            <PracticeSettings onStartGame={handleStartGame} />
          </div>
        )}

        {gameState === "playing" && (
          <PracticeGame settings={gameSettings} onEndGame={handleEndGame} />
        )}

        {gameState === "results" && (
          <GameResults
            score={gameStats.score}
            totalQuestions={gameStats.totalQuestions}
            timeElapsed={gameStats.timeElapsed}
            accuracy={gameStats.accuracy}
            onPlayAgain={handlePlayAgain}
            onBackToSettings={handleBackToSettings}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
