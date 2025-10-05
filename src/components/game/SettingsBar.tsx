"use client";

import { Globe, Hash, Eye, Keyboard, Repeat } from "lucide-react";
import { standardRegions } from "@/data/countries";

export type GameMode = "visual" | "typing" | "reverse";

interface SettingsBarProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  region: string;
  onRegionChange: (region: string) => void;
  questionCount: number | "all";
  onQuestionCountChange: (count: number | "all") => void;
}

export function SettingsBar({
  mode,
  onModeChange,
  region,
  onRegionChange,
  questionCount,
  onQuestionCountChange,
}: SettingsBarProps) {
  // Map standard regions to display format
  const regions = standardRegions.map((r) => ({
    value: r.id,
    label: r.id === "all"
      ? "all"
      : r.id === "north-america"
      ? "n. america"
      : r.id === "south-america"
      ? "s. america"
      : r.id,
  }));

  const modes: { value: GameMode; label: string; icon: typeof Eye }[] = [
    { value: "visual", label: "visual", icon: Eye },
    { value: "typing", label: "typing", icon: Keyboard },
    { value: "reverse", label: "reverse", icon: Repeat },
  ];

  return (
    <div className="relative z-10 py-4 px-6 flex items-center justify-center gap-8 text-sm flex-wrap">
      {/* Mode Selection */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.value}
                onClick={() => onModeChange(m.value)}
                className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                  mode === m.value
                    ? "text-yellow-400"
                    : "text-gray-500 hover:text-gray-300"
                }`}
                title={m.label}
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Region */}
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-gray-500" />
        <div className="flex items-center gap-1">
          {regions.map((r) => (
            <button
              key={r.value}
              onClick={() => onRegionChange(r.value)}
              className={`px-2 py-1 rounded transition-colors ${
                region === r.value
                  ? "text-yellow-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Question Count */}
      <div className="flex items-center gap-2">
        <Hash className="h-4 w-4 text-gray-500" />
        <div className="flex items-center gap-1">
          {[10, 15, 20, 30, "all"].map((count) => (
            <button
              key={count}
              onClick={() => onQuestionCountChange(count as number | "all")}
              className={`px-2 py-1 rounded transition-colors ${
                questionCount === count
                  ? "text-yellow-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {count}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
