import React from "react";
import * as FlagIcons from "country-flag-icons/react/3x2";

interface FlagProps {
  countryCode: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Flag({ countryCode, className = "", size = "md" }: FlagProps) {
  // Convert size to dimensions
  const sizeClasses = {
    sm: "w-8 h-6",
    md: "w-16 h-12",
    lg: "w-24 h-18",
    xl: "w-32 h-24",
  };

  // Get the flag component from country-flag-icons
  const FlagComponent = FlagIcons[countryCode.toUpperCase() as keyof typeof FlagIcons];

  if (!FlagComponent) {
    // Fallback for missing flags
    return (
      <div
        className={`${sizeClasses[size]} ${className} bg-gray-700 rounded flex items-center justify-center text-gray-400 text-xs`}
      >
        ?
      </div>
    );
  }

  return <FlagComponent className={`${sizeClasses[size]} ${className} rounded shadow-sm`} />;
}

// For custom region flags (like LOTR), we'll use emoji in a styled container
interface CustomFlagProps {
  emoji: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function CustomFlag({ emoji, className = "", size = "md" }: CustomFlagProps) {
  const sizeClasses = {
    sm: "w-8 h-6 text-2xl",
    md: "w-16 h-12 text-5xl",
    lg: "w-24 h-18 text-7xl",
    xl: "w-32 h-24 text-9xl",
  };

  return (
    <div
      className={`${sizeClasses[size]} ${className} bg-gray-800 rounded shadow-sm flex items-center justify-center`}
    >
      {emoji}
    </div>
  );
}
