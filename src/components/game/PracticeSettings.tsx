"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flag, Clock, Globe, Target } from "lucide-react";

interface PracticeSettingsProps {
  onStartGame: (settings: GameSettings) => void;
}

interface GameSettings {
  timeLimit: number;
  region: string;
  questionCount: number;
}

export function PracticeSettings({ onStartGame }: PracticeSettingsProps) {
  const [timeLimit, setTimeLimit] = useState(30);
  const [region, setRegion] = useState("all");
  const [questionCount, setQuestionCount] = useState(10);

  const handleStart = () => {
    onStartGame({ timeLimit, region, questionCount });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-gray-100 flex items-center">
            <Flag className="h-5 w-5 mr-2 text-yellow-400" />
            Practice Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Time Limit */}
          <div>
            <div className="flex items-center mb-3">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">
                Time per question
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[10, 15, 30, 60, 120].map((time) => (
                <button
                  key={time}
                  onClick={() => setTimeLimit(time)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    timeLimit === time
                      ? "bg-yellow-400 text-gray-900 font-medium"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {time}s
                </button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <div className="flex items-center mb-3">
              <Globe className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">Region</span>
            </div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-gray-700 text-gray-300 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">All regions</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="africa">Africa</option>
              <option value="north-america">North America</option>
              <option value="south-america">South America</option>
              <option value="oceania">Oceania</option>
            </select>
          </div>

          {/* Question Count */}
          <div>
            <div className="flex items-center mb-3">
              <Target className="h-4 w-4 mr-2 text-gray-400" />
              <span className="text-sm font-medium text-gray-300">
                Number of questions
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15, 20, 30].map((count) => (
                <button
                  key={count}
                  onClick={() => setQuestionCount(count)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    questionCount === count
                      ? "bg-yellow-400 text-gray-900 font-medium"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-4">
            <Button
              onClick={handleStart}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium py-3"
              size="lg"
            >
              <Flag className="h-5 w-5 mr-2" />
              Start Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
