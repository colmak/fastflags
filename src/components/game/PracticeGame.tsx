"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle, XCircle, SkipForward } from "lucide-react";

interface PracticeGameProps {
  settings: {
    timeLimit: number;
    region: string;
    questionCount: number;
  };
  onEndGame: (stats?: {
    score: number;
    totalQuestions: number;
    timeElapsed: number;
    accuracy: number;
  }) => void;
}

interface Question {
  id: string;
  flag: string;
  country: string;
  options: string[];
}

// Mock questions data
const mockQuestions: Question[] = [
  {
    id: "1",
    flag: "🇺🇸",
    country: "United States",
    options: ["United States", "Malaysia", "Liberia", "Uruguay"],
  },
  {
    id: "2",
    flag: "🇯🇵",
    country: "Japan",
    options: ["Japan", "Bangladesh", "Palau", "South Korea"],
  },
  {
    id: "3",
    flag: "🇫🇷",
    country: "France",
    options: ["France", "Netherlands", "Russia", "Luxembourg"],
  },
  {
    id: "4",
    flag: "🇩🇪",
    country: "Germany",
    options: ["Germany", "Belgium", "Estonia", "Austria"],
  },
  {
    id: "5",
    flag: "🇮🇹",
    country: "Italy",
    options: ["Italy", "Ireland", "Ivory Coast", "Mexico"],
  },
];

export function PracticeGame({ settings, onEndGame }: PracticeGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [gameStartTime] = useState(Date.now());

  const currentQuestion = gameQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.country;

  useEffect(() => {
    // Initialize questions (shuffle and limit based on settings)
    const shuffled = [...mockQuestions].sort(() => 0.5 - Math.random());
    setGameQuestions(
      shuffled.slice(0, Math.min(settings.questionCount, shuffled.length))
    );
  }, [settings.questionCount]);

  useEffect(() => {
    if (gameQuestions.length === 0) return;

    if (!showResult && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !selectedAnswer) {
      handleTimeUp();
    }
  }, [timeLeft, showResult, selectedAnswer, gameQuestions.length]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer || showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.country) {
      setScore((prev) => prev + 1);
    }
  };

  const handleTimeUp = () => {
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimeLeft(settings.timeLimit);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Game over - calculate final stats
      const timeElapsed = Math.floor((Date.now() - gameStartTime) / 1000);
      const accuracy = Math.round((score / gameQuestions.length) * 100);

      onEndGame({
        score,
        totalQuestions: gameQuestions.length,
        timeElapsed,
        accuracy,
      });
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  if (gameQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse text-gray-400">
              Loading questions...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Game Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-400">
          Question {currentQuestionIndex + 1} of {gameQuestions.length}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span className={timeLeft <= 5 ? "text-red-400 font-bold" : ""}>
              {timeLeft}s
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Score: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
        <div
          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
          style={{
            width: `${
              ((currentQuestionIndex + (showResult ? 1 : 0)) /
                gameQuestions.length) *
              100
            }%`,
          }}
        ></div>
      </div>

      {/* Question */}
      <Card className="bg-gray-800 border-gray-700 mb-6">
        <CardContent className="p-8 text-center">
          <div className="text-8xl mb-4">{currentQuestion.flag}</div>
          <p className="text-lg text-gray-300 mb-6">
            Which country does this flag belong to?
          </p>

          {/* Answer Options */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option) => {
              let buttonClass =
                "w-full p-4 text-left rounded-lg border transition-all ";

              if (!showResult) {
                buttonClass +=
                  "border-gray-600 bg-gray-700 hover:bg-gray-600 text-gray-300";
              } else {
                if (option === currentQuestion.country) {
                  buttonClass += "border-green-500 bg-green-900 text-green-100";
                } else if (option === selectedAnswer) {
                  buttonClass += "border-red-500 bg-red-900 text-red-100";
                } else {
                  buttonClass += "border-gray-600 bg-gray-700 text-gray-400";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && option === currentQuestion.country && (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    )}
                    {showResult &&
                      option === selectedAnswer &&
                      option !== currentQuestion.country && (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        {!showResult && (
          <Button
            onClick={handleSkip}
            variant="outline"
            className="border-gray-600 text-gray-400 hover:bg-gray-700"
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Skip
          </Button>
        )}

        {showResult && (
          <div className="flex items-center space-x-4 ml-auto">
            {selectedAnswer && (
              <div
                className={`flex items-center space-x-2 text-sm ${
                  isCorrect ? "text-green-400" : "text-red-400"
                }`}
              >
                {isCorrect ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Incorrect</span>
                  </>
                )}
              </div>
            )}

            <Button
              onClick={handleNext}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900"
            >
              {currentQuestionIndex < gameQuestions.length - 1
                ? "Next Question"
                : "Finish Game"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
