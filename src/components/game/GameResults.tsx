"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, Target, RotateCcw } from "lucide-react";

interface GameResultsProps {
  score: number;
  totalQuestions: number;
  timeElapsed: number;
  accuracy: number;
  onPlayAgain: () => void;
  onBackToSettings: () => void;
}

export function GameResults({
  score,
  totalQuestions,
  timeElapsed,
  accuracy,
  onPlayAgain,
  onBackToSettings,
}: GameResultsProps) {
  const [showStats, setShowStats] = useState(true);

  const percentage = Math.round((score / totalQuestions) * 100);
  const avgTimePerQuestion = Math.round(timeElapsed / totalQuestions);

  const getPerformanceMessage = () => {
    if (percentage >= 90)
      return { message: "Excellent!", color: "text-green-400" };
    if (percentage >= 80)
      return { message: "Great job!", color: "text-yellow-400" };
    if (percentage >= 70)
      return { message: "Good work!", color: "text-blue-400" };
    if (percentage >= 60)
      return { message: "Not bad!", color: "text-orange-400" };
    return { message: "Keep practicing!", color: "text-red-400" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-2xl mx-auto">
      {/* Results Header */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-8 text-center">
          <div className="mb-4">
            <Trophy className={`h-16 w-16 mx-auto mb-4 ${performance.color}`} />
            <h2 className="text-3xl font-bold text-white mb-2">
              Game Complete!
            </h2>
            <p className={`text-xl ${performance.color}`}>
              {performance.message}
            </p>
          </div>

          <div className="text-6xl font-bold text-white mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-2xl text-gray-400">{percentage}% Correct</div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      {showStats && (
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              Detailed Statistics
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{accuracy}%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">
                  {avgTimePerQuestion}s
                </div>
                <div className="text-sm text-gray-400">Avg per Question</div>
              </div>
            </div>

            <div className="mt-4 bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Total Time</span>
                <span className="text-white font-semibold">
                  {Math.floor(timeElapsed / 60)}:
                  {(timeElapsed % 60).toString().padStart(2, "0")}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Correct Answers</span>
                <span className="text-green-400 font-semibold">{score}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Incorrect Answers</span>
                <span className="text-red-400 font-semibold">
                  {totalQuestions - score}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={onPlayAgain}
          className="flex-1 bg-yellow-400 hover:bg-yellow-300 text-gray-900 py-3"
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Play Again
        </Button>

        <Button
          onClick={onBackToSettings}
          variant="outline"
          className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-700 py-3"
        >
          Change Settings
        </Button>
      </div>

      {/* Performance Tips */}
      <Card className="bg-gray-800 border-gray-700 mt-6">
        <CardContent className="p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">💡 Tip</h4>
          <p className="text-sm text-gray-400">
            {percentage >= 90
              ? "Amazing work! You're a flag expert. Try a different region or increase the difficulty."
              : percentage >= 70
              ? "Great progress! Practice more with specific regions to improve your accuracy."
              : "Keep practicing! Focus on one region at a time to build your knowledge systematically."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
