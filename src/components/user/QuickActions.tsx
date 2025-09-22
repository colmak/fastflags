"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Flag, Users, Zap, Trophy, Target, Clock } from "lucide-react";

export function QuickActions() {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-100 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-yellow-400" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-medium"
          size="sm"
        >
          <Flag className="h-4 w-4 mr-2" />
          Start Practice
        </Button>

        <Button
          variant="outline"
          className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          size="sm"
        >
          <Users className="h-4 w-4 mr-2" />
          Find Match
        </Button>

        <Button
          variant="ghost"
          className="w-full text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          size="sm"
        >
          <Trophy className="h-4 w-4 mr-2" />
          View Leaderboard
        </Button>

        <div className="border-t border-gray-700 pt-3 mt-3">
          <p className="text-xs text-gray-500 mb-2">Practice modes</p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            >
              <Target className="h-3 w-3 mr-1" />
              Focus
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            >
              <Clock className="h-3 w-3 mr-1" />
              Timed
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
