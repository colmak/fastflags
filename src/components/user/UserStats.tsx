"use client";

import { useSession } from "next-auth/react";

export function UserStats() {
  const { data: session } = useSession();

  if (!session) return null;

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
