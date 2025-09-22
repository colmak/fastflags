"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Edit, Settings } from "lucide-react";
import Image from "next/image";

export function UserProfile() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-gray-100 flex items-center">
          <User className="h-5 w-5 mr-2 text-yellow-400" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-100">{session.user.name}</h3>
            <p className="text-sm text-gray-400">{session.user.email}</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <span className="text-xs text-gray-400">Online</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Member since</span>
            <span className="text-gray-300">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Account type</span>
            <span className="text-yellow-400">Free</span>
          </div>
        </div>

        <div className="pt-2 space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          >
            <Settings className="h-4 w-4 mr-2" />
            Account Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
