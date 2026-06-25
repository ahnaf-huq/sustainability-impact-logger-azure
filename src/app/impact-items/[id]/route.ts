import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { impactItemStatusSchema } from "@/lib/validators";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid or missing JSON request body." },
      { status: 400 }
    );
  }

  const validated = impactItemStatusSchema.safeParse(body);

  if (!validated.success) {
    return NextResponse.json(
      {
        error: "Validation failed.",
        details: validated.error.issues,
      },
      { status: 400 }
    );
  }

  const existingItem = await prisma.impactItem.findUnique({
    where: { id },
  });

  if (!existingItem) {
    return NextResponse.json(
      { error: "Impact item not found." },
      { status: 404 }
    );
  }

  const updatedItem = await prisma.impactItem.update({
    where: { id },
    data: {
      status: validated.data.status,
    },
  });

  return NextResponse.json(updatedItem);
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  const { id } = await params;

  const existingItem = await prisma.impactItem.findUnique({
    where: { id },
  });

  if (!existingItem) {
    return NextResponse.json(
      { error: "Impact item not found." },
      { status: 404 }
    );
  }

  await prisma.impactItem.delete({
    where: { id },
  });

  return new NextResponse(null, {
    status: 204,
  });
}