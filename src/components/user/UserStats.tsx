"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Target, Zap } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <div className="bg-gray-750 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-100">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full bg-gray-700 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function UserStats() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex items-center space-x-8 mt-12 text-sm text-gray-500">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-300">0</div>
          <div>flags learned</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium text-gray-300">1200</div>
          <div>rating</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium text-gray-300">0</div>
          <div>games played</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-medium text-gray-300">0%</div>
          <div>accuracy</div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-100 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2 text-yellow-400" />
          Your Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Flags Learned"
            value={47}
            subtitle="of 195 total"
            icon={Target}
            color="text-blue-400"
          />
          <StatCard
            title="Current Rating"
            value={1247}
            subtitle="+23 this week"
            icon={TrendingUp}
            color="text-green-400"
          />
          <StatCard
            title="Games Played"
            value={23}
            subtitle="8 wins, 15 losses"
            icon={Zap}
            color="text-purple-400"
          />
          <StatCard
            title="Accuracy"
            value="78%"
            subtitle="improving +2%"
            icon={Target}
            color="text-yellow-400"
          />
        </div>

        <div className="mt-6 p-4 bg-gray-750 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-gray-300">
              Recent Performance
            </h4>
            <span className="text-xs text-gray-500">Last 7 days</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Best streak</span>
              <span className="text-gray-300">12 correct</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Fastest answer</span>
              <span className="text-gray-300">1.2s</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Most improved region</span>
              <span className="text-green-400">Europe (+15%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
