import { NextResponse } from "next/server";
import { mentorConversationToResponse } from "@/lib/ai/serialize-mentor";
import {
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { mentorConversationSearchSchema } from "@/types/mentor";
import type { Prisma } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const { searchParams } = new URL(request.url);

    const filters = mentorConversationSearchSchema.parse({
      projectId: searchParams.get("projectId") ?? undefined,
      topic: searchParams.get("topic") ?? undefined,
      query: searchParams.get("query") ?? undefined,
      fromDate: searchParams.get("fromDate") ?? undefined,
      toDate: searchParams.get("toDate") ?? undefined,
      limit: searchParams.get("limit") ?? 20,
    });

    const where: Prisma.MentorConversationWhereInput = {
      userId: session.user.id,
    };

    if (filters.projectId) {
      where.projectId = filters.projectId;
    }

    if (filters.topic) {
      where.topic = filters.topic;
    }

    if (filters.query) {
      where.title = { contains: filters.query };
    }

    if (filters.fromDate || filters.toDate) {
      where.createdAt = {};
      if (filters.fromDate) {
        where.createdAt.gte = new Date(filters.fromDate);
      }
      if (filters.toDate) {
        where.createdAt.lte = new Date(filters.toDate);
      }
    }

    const conversations = await prisma.mentorConversation.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: filters.limit,
      include: {
        project: { select: { title: true } },
        _count: { select: { messages: true } },
      },
    });

    return NextResponse.json({
      conversations: conversations.map(mentorConversationToResponse),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid search parameters" },
        { status: 400 }
      );
    }

    console.error("[GET /api/mentor/conversations]", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
