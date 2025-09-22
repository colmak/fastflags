"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { FloatingFlags } from "@/components/layout/FloatingFlags";
import { Footer } from "@/components/layout/Footer";
import { UserProfile } from "@/components/user/UserProfile";
import { UserStats } from "@/components/user/UserStats";
import { RecentActivity } from "@/components/user/RecentActivity";
import { QuickActions } from "@/components/user/QuickActions";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-lg">
          loading dashboard...
        </div>
      </div>
    );
  }

  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <FloatingFlags />
      <Header />

      <main className="relative z-10 container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Dashboard</h1>
          <p className="text-gray-400">
            Welcome back, {session.user?.name?.split(" ")[0]}!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Quick Actions */}
          <div className="space-y-6">
            <UserProfile />
            <QuickActions />
          </div>

          {/* Middle Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            <UserStats />
            <RecentActivity />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
