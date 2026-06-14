import { NextResponse } from "next/server";
import { buildMentorContext } from "@/lib/ai/contextBuilder";
import { generateMentorResponse } from "@/lib/ai/mentor";
import { GeminiQuotaError, GeminiUnavailableError } from "@/lib/ai/errors";
import {
  generateConversationTitle,
  mentorConversationToResponse,
  mentorMessageToResponse,
} from "@/lib/ai/serialize-mentor";
import {
  getProjectForUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
} from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/portfolio/activity";
import {
  detectMentorTopic,
  mentorChatRequestSchema,
  type MentorMode,
} from "@/types/mentor";

export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const body = await request.json();
    const { question, projectId, conversationId, mode } =
      mentorChatRequestSchema.parse(body);

    if (mode !== "portfolio" && !projectId) {
      return NextResponse.json(
        { error: "Project ID is required for project and founder coach modes" },
        { status: 400 }
      );
    }

    if (projectId) {
      await getProjectForUser(projectId, session.user.id);
    }

    let conversation = conversationId
      ? await prisma.mentorConversation.findFirst({
          where: { id: conversationId, userId: session.user.id },
          include: {
            messages: { orderBy: { createdAt: "asc" }, take: 20 },
          },
        })
      : null;

    if (conversationId && !conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    const history =
      conversation?.messages.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })) ?? [];

    const context = await buildMentorContext(session.user.id, {
      mode: mode as MentorMode,
      projectId,
      conversationHistory: history,
    });

    const topic = detectMentorTopic(question);

    const { response, usedFallback, attempts, model } =
      await generateMentorResponse({
        context,
        question,
        topic,
      });

    if (!conversation) {
      conversation = await prisma.mentorConversation.create({
        data: {
          userId: session.user.id,
          projectId: projectId ?? null,
          title: generateConversationTitle(question),
          mode,
          topic,
        },
        include: { messages: true },
      });

      await logActivity({
        userId: session.user.id,
        projectId: projectId ?? undefined,
        type: "mentor_conversation",
        title: `AI Mentor: ${generateConversationTitle(question)}`,
        description: mode === "portfolio" ? "Portfolio mentor session" : "Project mentor session",
      });
    } else if (conversation.topic === "general" && topic !== "general") {
      await prisma.mentorConversation.update({
        where: { id: conversation.id },
        data: { topic, updatedAt: new Date() },
      });
    }

    const userMessage = await prisma.mentorMessage.create({
      data: {
        conversationId: conversation.id,
        role: "user",
        content: question,
      },
    });

    const assistantMessage = await prisma.mentorMessage.create({
      data: {
        conversationId: conversation.id,
        role: "assistant",
        content: response.answer,
        responseData: response,
      },
    });

    await prisma.mentorConversation.update({
      where: { id: conversation.id },
      data: { updatedAt: new Date() },
    });

    let projectTitle: string | null = null;
    if (projectId) {
      const project = await getProjectForUser(projectId, session.user.id);
      projectTitle = project.title;
    }

    return NextResponse.json({
      conversation: mentorConversationToResponse({
        ...conversation,
        project: projectTitle ? { title: projectTitle } : null,
      }),
      userMessage: mentorMessageToResponse(userMessage),
      assistantMessage: mentorMessageToResponse(assistantMessage),
      response,
      usedFallback,
      attempts,
      model,
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
        { error: "Invalid request data" },
        { status: 400 }
      );
    }
    if (error instanceof GeminiQuotaError) {
      return NextResponse.json({ error: error.message }, { status: 429 });
    }
    if (error instanceof GeminiUnavailableError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    if (
      error instanceof Error &&
      error.message === "GEMINI_API_KEY is not configured"
    ) {
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 503 }
      );
    }

    console.error("[POST /api/mentor]", error);
    return NextResponse.json(
      { error: "Failed to generate mentor response" },
      { status: 500 }
    );
  }
}
