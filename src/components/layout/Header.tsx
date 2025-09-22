"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Flag, Settings, User, Trophy, Users } from "lucide-react";

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="relative z-10 flex items-center justify-between p-6 border-b border-gray-800">
      <div className="flex items-center space-x-3">
        <Flag className="h-6 w-6 text-yellow-400" />
        <h1 className="text-xl font-medium text-gray-100">fastflags</h1>
      </div>

      <nav className="hidden md:flex items-center space-x-8 text-sm">
        <button className="text-yellow-400 hover:text-yellow-300 transition-colors">
          <Flag className="inline h-4 w-4 mr-1" />
          practice
        </button>
        <button className="text-gray-400 hover:text-gray-300 transition-colors">
          <Users className="inline h-4 w-4 mr-1" />
          multiplayer
        </button>
        <button className="text-gray-400 hover:text-gray-300 transition-colors">
          <Trophy className="inline h-4 w-4 mr-1" />
          leaderboard
        </button>
        <button className="text-gray-400 hover:text-gray-300 transition-colors">
          <Settings className="inline h-4 w-4 mr-1" />
          settings
        </button>
      </nav>

      <div className="flex items-center space-x-4">
        {session ? (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <User className="h-4 w-4" />
              <span>{session.user?.name?.split(" ")[0] || "user"}</span>
            </div>
            <Button
              onClick={() => signOut()}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-200"
            >
              sign out
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => signIn("google")}
            variant="outline"
            size="sm"
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            sign in
          </Button>
        )}
      </div>
    </header>
  );
}
