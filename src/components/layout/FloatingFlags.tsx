"use client";

import { useState, useEffect } from "react";

const ALL_FLAGS = [
  "🇺🇸",
  "🇯🇵",
  "🇧🇷",
  "🇫🇷",
  "🇦🇺",
  "🇩🇪",
  "🇨🇦",
  "🇮🇹",
  "🇪🇸",
  "🇬🇧",
  "🇨🇳",
  "🇮🇳",
  "🇷🇺",
  "🇲🇽",
  "🇰🇷",
  "🇳🇱",
  "🇸🇪",
  "🇳🇴",
  "🇩🇰",
  "🇫🇮",
  "🇨🇭",
  "🇦🇹",
  "🇧🇪",
  "🇵🇹",
  "🇬🇷",
  "🇹🇷",
  "🇮🇪",
  "🇮🇸",
  "🇱🇺",
  "🇵🇱",
  "🇨🇿",
  "🇸🇰",
  "🇭🇺",
  "🇷🇴",
  "🇧🇬",
  "🇭🇷",
  "🇸🇮",
  "🇪🇪",
  "🇱🇻",
  "🇱🇹",
  "🇺🇦",
  "🇧🇾",
  "🇲🇩",
  "🇷🇸",
  "🇲🇰",
  "🇦🇱",
  "🇲🇪",
  "🇧🇦",
  "🇽🇰",
  "🇲🇹",
  "🇨🇾",
  "🇮🇱",
  "🇵🇸",
  "🇯🇴",
  "🇱🇧",
  "🇸🇾",
  "🇮🇶",
  "🇸🇦",
  "🇦🇪",
  "🇰🇼",
  "🇶🇦",
  "🇧🇭",
  "🇴🇲",
  "🇾🇪",
  "🇮🇷",
  "🇦🇫",
  "🇵🇰",
  "🇧🇩",
  "🇱🇰",
  "🇳🇵",
  "🇧🇹",
  "🇲🇻",
  "🇲🇾",
  "🇸🇬",
  "🇹🇭",
  "🇰🇭",
  "🇱🇦",
  "🇻🇳",
  "🇲🇲",
  "🇮🇩",
  "🇵🇭",
  "🇧🇳",
  "🇹🇱",
  "🇫🇯",
  "🇳🇿",
  "🇵🇬",
  "🇸🇧",
  "🇻🇺",
  "🇳🇨",
  "🇼🇸",
];

function getRandomFlags(count: number): string[] {
  const shuffled = [...ALL_FLAGS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function FloatingFlags() {
  const [leftFlags, setLeftFlags] = useState<string[]>([]);
  const [rightFlags, setRightFlags] = useState<string[]>([]);
  const [flagCount, setFlagCount] = useState(6);

  useEffect(() => {
    // Calculate how many flags can fit based on screen size
    const updateFlagCount = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) {
        setFlagCount(3); // Mobile
      } else if (screenWidth < 1024) {
        setFlagCount(5); // Tablet
      } else if (screenWidth < 1440) {
        setFlagCount(7); // Desktop
      } else {
        setFlagCount(10); // Large desktop
      }
    };

    updateFlagCount();
    window.addEventListener("resize", updateFlagCount);

    return () => window.removeEventListener("resize", updateFlagCount);
  }, []);

  useEffect(() => {
    // Generate flags for both sides
    const allRandomFlags = getRandomFlags(flagCount * 2);
    setLeftFlags(allRandomFlags.slice(0, flagCount));
    setRightFlags(allRandomFlags.slice(flagCount));
  }, [flagCount]);

  return (
    <div className="fixed top-0 left-0 right-0 h-20 pointer-events-none z-0 overflow-hidden">
      {/* Left side flags */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 flex space-x-2 sm:space-x-3 md:space-x-4 pl-4 sm:pl-6">
        {leftFlags.map((flag, index) => (
          <div
            key={`left-${index}`}
            className="text-xl sm:text-2xl md:text-3xl opacity-15 animate-pulse"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            {flag}
          </div>
        ))}
      </div>

      {/* Right side flags */}
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex space-x-2 sm:space-x-3 md:space-x-4 pr-4 sm:pr-6 flex-row-reverse">
        {rightFlags.map((flag, index) => (
          <div
            key={`right-${index}`}
            className="text-xl sm:text-2xl md:text-3xl opacity-15 animate-pulse"
            style={{ animationDelay: `${(index + flagCount) * 0.3}s` }}
          >
            {flag}
          </div>
        ))}
      </div>
    </div>
  );
}
