"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Flag, Users, Zap } from "lucide-react";
import { useState } from "react";

interface GameControlsProps {
  onStartGame: (settings: GameSettings) => void;
}

interface GameSettings {
  mode: "practice" | "multiplayer";
  timeLimit: number;
  region: string;
}

export function GameControls({ onStartGame }: GameControlsProps) {
  const { data: session } = useSession();
  const [mode, setMode] = useState<"practice" | "multiplayer">("practice");
  const [timeLimit, setTimeLimit] = useState(30);
  const [region, setRegion] = useState("all");

  const handleStart = () => {
    onStartGame({ mode, timeLimit, region });
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center px-6">
      {/* Mode Selector */}
      <div className="flex items-center space-x-1 mb-8 bg-gray-800 rounded-lg p-1">
        <button
          onClick={() => setMode("practice")}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            mode === "practice"
              ? "bg-yellow-400 text-gray-900"
              : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Flag className="inline h-4 w-4 mr-2" />
          practice
        </button>
        <button
          onClick={() => setMode("multiplayer")}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            mode === "multiplayer"
              ? "bg-yellow-400 text-gray-900"
              : "text-gray-400 hover:text-gray-200"
          }`}
          disabled={!session}
        >
          <Users className="inline h-4 w-4 mr-2" />
          multiplayer
        </button>
      </div>

      {/* Multiplayer requires login message */}
      {mode === "multiplayer" && !session && (
        <p className="text-gray-500 text-sm mb-4">
          sign in required for multiplayer
        </p>
      )}

      {/* Settings Panel */}
      <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm">
        {/* Time Limit */}
        <div className="flex items-center space-x-3">
          <span className="text-gray-400">time</span>
          <div className="flex items-center space-x-1">
            {[15, 30, 60, 120].map((time) => (
              <button
                key={time}
                onClick={() => setTimeLimit(time)}
                className={`px-3 py-1 rounded transition-colors ${
                  timeLimit === time
                    ? "bg-yellow-400 text-gray-900"
                    : "bg-gray-800 text-gray-400 hover:text-gray-200"
                }`}
              >
                {time}s
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div className="flex items-center space-x-3">
          <span className="text-gray-400">region</span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-gray-800 text-gray-300 border border-gray-700 rounded px-3 py-1 focus:outline-none focus:ring-1 focus:ring-yellow-400"
          >
            <option value="all">all regions</option>
            <option value="europe">europe</option>
            <option value="asia">asia</option>
            <option value="africa">africa</option>
            <option value="north-america">north america</option>
            <option value="south-america">south america</option>
            <option value="oceania">oceania</option>
          </select>
        </div>
      </div>

      {/* Start Button */}
      <Button
        size="lg"
        className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium px-8 py-3 text-lg"
        disabled={mode === "multiplayer" && !session}
        onClick={handleStart}
      >
        {mode === "practice" ? "start practice" : "find match"}
        <Zap className="ml-2 h-5 w-5" />
      </Button>

      {/* Sign in suggestion for better experience */}
      {!session && (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm mb-3">
            sign in to save progress and compete with others
          </p>
          <Button
            onClick={() => signIn("google")}
            variant="outline"
            size="sm"
            className="border-gray-600 text-gray-400 hover:bg-gray-800"
          >
            sign in with google
          </Button>
        </div>
      )}
    </div>
  );
}
