"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { FloatingFlags } from "@/components/layout/FloatingFlags";
import { GameControls } from "@/components/game/GameControls";
import { UserStats } from "@/components/user/UserStats";
import { Footer } from "@/components/layout/Footer";

interface GameSettings {
  mode: "practice" | "multiplayer";
  timeLimit: number;
  region: string;
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartGame = async (settings: GameSettings) => {
    setIsLoading(true);

    // TODO: Navigate to game page or start game logic
    console.log("Starting game with settings:", settings);

    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">
          loading game...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <FloatingFlags />
      <Header />

      <main className="flex flex-col items-center justify-center flex-1 px-6 py-20">
        <GameControls onStartGame={handleStartGame} />
        <UserStats />
      </main>

      <Footer />
    </div>
  );
}
