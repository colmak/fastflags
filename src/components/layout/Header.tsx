"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flag, Settings, User, Trophy, Users, Home } from "lucide-react";

export function Header() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "home", icon: Home },
    { href: "/dashboard", label: "dashboard", icon: User, requireAuth: true },
    { href: "/practice", label: "practice", icon: Flag },
    {
      href: "/multiplayer",
      label: "multiplayer",
      icon: Users,
      requireAuth: true,
    },
    { href: "/leaderboard", label: "leaderboard", icon: Trophy },
    { href: "/settings", label: "settings", icon: Settings },
  ];

  return (
    <header className="relative z-10 flex items-center justify-between p-6 border-b border-gray-800">
      <Link href="/" className="flex items-center space-x-3">
        <Flag className="h-6 w-6 text-yellow-400" />
        <h1 className="text-xl font-medium text-gray-100">fastflags</h1>
      </Link>

      <nav className="hidden md:flex items-center space-x-8 text-sm">
        {navItems.map((item) => {
          // Hide auth-required items if not logged in
          if (item.requireAuth && !session) return null;

          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${
                isActive
                  ? "text-yellow-400 hover:text-yellow-300"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Icon className="inline h-4 w-4 mr-1" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center space-x-4">
        {session ? (
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              <User className="h-4 w-4" />
              <span>{session.user?.name?.split(" ")[0] || "user"}</span>
            </Link>
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
