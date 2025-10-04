"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { SettingsBar, type GameMode } from "@/components/game/SettingsBar";
import { PracticeGame } from "@/components/game/PracticeGame";
import { GameResults } from "@/components/game/GameResults";
import { Footer } from "@/components/layout/Footer";
import { CommandPalette } from "@/components/ui/CommandPalette";

type GameState = "playing" | "results";

interface GameStats {
  score: number;
  totalQuestions: number;
  timeElapsed: number;
  accuracy: number;
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("playing");
  const [mode, setMode] = useState<GameMode>("visual");
  const [region, setRegion] = useState("all");
  const [questionCount, setQuestionCount] = useState<number | "all">(10);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    totalQuestions: 0,
    timeElapsed: 0,
    accuracy: 0,
  });
  const [gameKey, setGameKey] = useState(0);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Load saved settings from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("mode");
    const savedRegion = localStorage.getItem("region");
    const savedQuestionCount = localStorage.getItem("questionCount");

    if (savedMode) setMode(savedMode as GameMode);
    if (savedRegion) setRegion(savedRegion);
    if (savedQuestionCount) {
      const count = savedQuestionCount === "all" ? "all" : Number(savedQuestionCount);
      setQuestionCount(count);
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("mode", mode);
    localStorage.setItem("region", region);
    localStorage.setItem("questionCount", questionCount.toString());
  }, [mode, region, questionCount]);

  const handleEndGame = (stats?: GameStats) => {
    if (stats) {
      setGameStats(stats);
      setGameState("results");
    }
  };

  const handleRestart = () => {
    setGameState("playing");
    setGameKey((prev) => prev + 1);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette: Esc or Ctrl+Shift+P
      if (e.key === "Escape" && !commandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      } else if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key === "P" &&
        !commandPaletteOpen
      ) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // Restart: Tab
      else if (e.key === "Tab" && !commandPaletteOpen) {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen]);

  const handlePlayAgain = () => {
    handleRestart();
  };

  const handleBackToSettings = () => {
    handleRestart();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Header />
      <SettingsBar
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          handleRestart();
        }}
        region={region}
        onRegionChange={(r) => {
          setRegion(r);
          handleRestart();
        }}
        questionCount={questionCount}
        onQuestionCountChange={(count) => {
          setQuestionCount(count);
          handleRestart();
        }}
      />

      <main className="flex-1 container mx-auto px-6 py-8">
        {gameState === "playing" && (
          <PracticeGame
            key={gameKey}
            mode={mode}
            settings={{ region, questionCount }}
            onEndGame={handleEndGame}
          />
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

      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        region={region}
        onRegionChange={(r) => {
          setRegion(r);
          handleRestart();
        }}
        questionCount={questionCount}
        onQuestionCountChange={(count) => {
          setQuestionCount(count);
          handleRestart();
        }}
      />
    </div>
  );
}
