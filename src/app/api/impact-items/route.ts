import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { impactItemSchema } from "@/lib/validators";

export async function GET() {
  const items = await prisma.impactItem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  const body = await request.json();

  const validated =
    impactItemSchema.parse(body);

  const item =
    await prisma.impactItem.create({
      data: validated,
    });

  return NextResponse.json(item, {
    status: 201,
  });
}