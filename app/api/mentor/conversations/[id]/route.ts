import { NextResponse } from "next/server";
import { mentorConversationToResponse } from "@/lib/ai/serialize-mentor";
import {
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const session = await requireAuth();
    const { id } = await params;

    const conversation = await prisma.mentorConversation.findFirst({
      where: { id, userId: session.user.id },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
        project: { select: { title: true } },
        _count: { select: { messages: true } },
      },
    });

    if (!conversation) {
      throw new NotFoundError("Conversation not found");
    }

    return NextResponse.json({
      conversation: mentorConversationToResponse(conversation),
    });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    console.error("[GET /api/mentor/conversations/[id]]", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}
