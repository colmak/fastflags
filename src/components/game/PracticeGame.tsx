"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import type { GameMode } from "@/components/game/SettingsBar";
import { countries, getCountriesByRegion, type Country } from "@/data/countries";
import { lotrRegions, generateLotrQuestions } from "@/data/lotr";
import { Flag, CustomFlag } from "@/components/ui/Flag";

interface PracticeGameProps {
  mode: GameMode;
  settings: {
    region: string;
    questionCount: number | "all";
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
  flag: string; // Either country code or emoji for custom regions
  country: string;
  options: string[];
  isCustomRegion?: boolean;
}

// Helper function to generate question options
function generateQuestionOptions(correctCountry: Country, allCountries: Country[]): string[] {
  const options = [correctCountry.name];
  const otherCountries = allCountries.filter((c) => c.name !== correctCountry.name);

  // Pick 3 random wrong answers
  const shuffled = [...otherCountries].sort(() => 0.5 - Math.random());
  options.push(...shuffled.slice(0, 3).map((c) => c.name));

  // Shuffle the options
  return options.sort(() => 0.5 - Math.random());
}

// Helper function to generate questions from countries
function generateCountryQuestions(regionId: string, count: number | "all"): Question[] {
  // Check if this is an LOTR region
  const isLotrRegion = lotrRegions.some((r) => r.id === regionId);

  if (isLotrRegion) {
    const lotrQuestions = generateLotrQuestions();
    const questionCount = count === "all" ? lotrQuestions.length : Math.min(count, lotrQuestions.length);
    return lotrQuestions.slice(0, questionCount).map((q) => ({
      id: q.id,
      flag: q.flag, // Keep emoji for LOTR
      country: q.region,
      options: q.options,
      isCustomRegion: true,
    }));
  }

  // Regular country questions
  const regionCountries = getCountriesByRegion(regionId);
  const shuffled = [...regionCountries].sort(() => 0.5 - Math.random());
  const questionCount = count === "all" ? shuffled.length : Math.min(count, shuffled.length);

  return shuffled.slice(0, questionCount).map((country, index) => ({
    id: `${country.code}-${index}`,
    flag: country.code, // Use country code instead of emoji
    country: country.name,
    options: generateQuestionOptions(country, regionCountries),
    isCustomRegion: false,
  }));
}

export function PracticeGame({ mode, settings, onEndGame }: PracticeGameProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [gameQuestions, setGameQuestions] = useState<Question[]>([]);
  const [gameStartTime] = useState(Date.now());
  const typingInputRef = useRef<HTMLInputElement>(null);

  const currentQuestion = gameQuestions[currentQuestionIndex];
  const isCorrect = mode === "typing"
    ? typedAnswer.toLowerCase().trim() === currentQuestion?.country.toLowerCase()
    : selectedAnswer === currentQuestion?.country || selectedAnswer === currentQuestion?.flag;

  // Auto-focus typing input when question changes
  useEffect(() => {
    if (mode === "typing" && typingInputRef.current && !showResult) {
      typingInputRef.current.focus();
    }
  }, [currentQuestionIndex, mode, showResult]);

  useEffect(() => {
    // Initialize questions based on region and question count
    const questions = generateCountryQuestions(settings.region, settings.questionCount);
    setGameQuestions(questions);
  }, [settings.region, settings.questionCount]);


  // Keyboard controls (only for visual/reverse modes)
  useEffect(() => {
    if (!currentQuestion || showResult || mode === "typing") return;

    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key;
      if (key >= "1" && key <= "4") {
        const index = parseInt(key) - 1;
        if (index < currentQuestion.options.length) {
          handleAnswer(currentQuestion.options[index]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentQuestion, showResult, mode]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer || showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentQuestion.country) {
      setScore((prev) => prev + 1);
    }

    // Auto-advance after 100ms
    setTimeout(() => {
      handleNext();
    }, 100);
  };

  const handleTypingSubmit = () => {
    if (showResult || !typedAnswer.trim()) return;

    setShowResult(true);

    // Fuzzy match check
    const isMatch = typedAnswer.toLowerCase().trim() === currentQuestion.country.toLowerCase();

    if (isMatch) {
      setScore((prev) => prev + 1);
    }

    // Auto-advance after 100ms
    setTimeout(() => {
      handleNext();
    }, 100);
  };

  const handleNext = () => {
    if (currentQuestionIndex < gameQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setTypedAnswer("");
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
        <div className="text-sm text-gray-400">
          Score: {score}/{currentQuestionIndex + (showResult ? 1 : 0)}
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
          {mode === "typing" ? (
            // Typing mode: Show flag, type country name
            <>
              <div className="mb-6 flex justify-center">
                {currentQuestion.isCustomRegion ? (
                  <CustomFlag emoji={currentQuestion.flag} size="xl" />
                ) : (
                  <Flag countryCode={currentQuestion.flag} size="xl" />
                )}
              </div>
              <p className="text-lg text-gray-300 mb-6">
                Type the country name
              </p>

              <div className="max-w-md mx-auto">
                <input
                  ref={typingInputRef}
                  type="text"
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleTypingSubmit();
                    }
                  }}
                  disabled={showResult}
                  placeholder="Country name..."
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                {showResult && (
                  <div className="mt-4 text-sm">
                    {isCorrect ? (
                      <span className="text-green-400">✓ Correct!</span>
                    ) : (
                      <span className="text-red-400">
                        ✗ Incorrect - Answer: {currentQuestion.country}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : mode === "reverse" ? (
            // Reverse mode: Show country name, pick flag
            <>
              <div className="text-3xl mb-4 font-medium text-gray-100">
                {currentQuestion.country}
              </div>
              <p className="text-lg text-gray-300 mb-6">
                Which flag belongs to this country?
              </p>

              {/* Flag Options */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {currentQuestion.options.map((option, index) => {
                  // For reverse mode, find the flag for this country option
                  const isCustomRegion = currentQuestion.isCustomRegion;
                  let flagCode = "";
                  let flagEmoji = "🏳️";

                  if (isCustomRegion) {
                    // Find LOTR region flag
                    const lotrRegion = lotrRegions.find((r) => r.name === option);
                    flagEmoji = lotrRegion?.flag || "🏳️";
                  } else {
                    // Find country code
                    const country = countries.find((c) => c.name === option);
                    flagCode = country?.code || "";
                  }

                  let buttonClass =
                    "p-6 rounded-lg border transition-all text-center ";

                  if (!showResult) {
                    buttonClass +=
                      "border-gray-600 bg-gray-700 hover:bg-gray-600";
                  } else {
                    if (option === currentQuestion.country) {
                      buttonClass += "border-green-500 bg-green-900";
                    } else if (option === selectedAnswer) {
                      buttonClass += "border-red-500 bg-red-900";
                    } else {
                      buttonClass += "border-gray-600 bg-gray-700 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={showResult}
                      className={buttonClass}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <kbd className="px-2 py-1 bg-gray-800 rounded text-xs font-mono text-gray-500">
                          {index + 1}
                        </kbd>
                        <div className="flex justify-center">
                          {isCustomRegion ? (
                            <CustomFlag emoji={flagEmoji} size="lg" />
                          ) : (
                            flagCode && <Flag countryCode={flagCode} size="lg" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            // Visual mode: Show flag, pick country name
            <>
              <div className="mb-6 flex justify-center">
                {currentQuestion.isCustomRegion ? (
                  <CustomFlag emoji={currentQuestion.flag} size="xl" />
                ) : (
                  <Flag countryCode={currentQuestion.flag} size="xl" />
                )}
              </div>
              <p className="text-lg text-gray-300 mb-6">
                Which country does this flag belong to?
              </p>

              {/* Answer Options */}
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((option, index) => {
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
                        <div className="flex items-center gap-3">
                          <kbd className="px-2 py-1 bg-gray-800 rounded text-xs font-mono text-gray-500">
                            {index + 1}
                          </kbd>
                          <span>{option}</span>
                        </div>
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
            </>
          )}
        </CardContent>
      </Card>

      {/* Feedback indicator (for non-typing modes) */}
      {showResult && (selectedAnswer || mode === "typing") && mode !== "typing" && (
        <div className="text-center mt-4">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              isCorrect
                ? "bg-green-900 text-green-100"
                : "bg-red-900 text-red-100"
            }`}
          >
            {isCorrect ? (
              <>
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Incorrect</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
