import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: "ready",
      service: "sustainability-impact-logger",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database readiness check failed:", error);

    return NextResponse.json(
      {
        status: "not-ready",
        service: "sustainability-impact-logger",
        database: "unavailable",
      },
      { status: 503 }
    );
  }
}