"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Flag, Trophy, Target } from "lucide-react";

export function RecentActivity() {
  // Mock recent activity data
  const activities = [
    {
      id: 1,
      type: "practice",
      title: "Completed Europe Practice",
      description: "Scored 85% on 20 flags",
      time: "2 hours ago",
      icon: Flag,
      color: "text-blue-400",
    },
    {
      id: 2,
      type: "achievement",
      title: "Achievement Unlocked",
      description: "European Explorer - Master 50 European flags",
      time: "1 day ago",
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      id: 3,
      type: "practice",
      title: "Quick Practice Session",
      description: "15-second challenge - 12/15 correct",
      time: "2 days ago",
      icon: Target,
      color: "text-green-400",
    },
    {
      id: 4,
      type: "multiplayer",
      title: "Multiplayer Match",
      description: "Won against FlagMaster92 (1205 → 1218)",
      time: "3 days ago",
      icon: Trophy,
      color: "text-purple-400",
    },
  ];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-100 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-yellow-400" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-gray-750 hover:bg-gray-700 transition-colors"
              >
                <div
                  className={`p-2 rounded-full bg-gray-700 ${activity.color}`}
                >
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100">
                    {activity.title}
                  </p>
                  <p className="text-sm text-gray-400">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-700">
          <button className="text-sm text-yellow-400 hover:text-yellow-300 transition-colors">
            View all activity →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
