import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection by counting records
    const contentTypes = await prisma.contentType.count();
    const countries = await prisma.country.count();
    const contentItems = await prisma.contentItem.count();
    const achievements = await prisma.achievement.count();

    return NextResponse.json({
      status: "success",
      message: "Database connection working!",
      data: {
        contentTypes,
        countries,
        contentItems,
        achievements,
      },
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
