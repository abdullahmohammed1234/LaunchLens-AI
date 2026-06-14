import type { MentorConversation, MentorMessage } from "@prisma/client";
import {
  mentorResponseSchema,
  storedMentorConversationSchema,
  storedMentorMessageSchema,
  type MentorResponse,
  type StoredMentorConversation,
  type StoredMentorMessage,
} from "@/types/mentor";

export function mentorMessageToResponse(
  record: MentorMessage
): StoredMentorMessage {
  let responseData: MentorResponse | null = null;
  if (record.responseData) {
    const parsed = mentorResponseSchema.safeParse(record.responseData);
    responseData = parsed.success ? parsed.data : null;
  }

  return storedMentorMessageSchema.parse({
    id: record.id,
    conversationId: record.conversationId,
    role: record.role,
    content: record.content,
    responseData,
    createdAt: record.createdAt.toISOString(),
  });
}

export function mentorConversationToResponse(
  record: MentorConversation & {
    messages?: MentorMessage[];
    project?: { title: string } | null;
    _count?: { messages: number };
  }
): StoredMentorConversation {
  return storedMentorConversationSchema.parse({
    id: record.id,
    userId: record.userId,
    projectId: record.projectId,
    projectTitle: record.project?.title ?? null,
    title: record.title,
    mode: record.mode,
    topic: record.topic,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
    messages: record.messages?.map(mentorMessageToResponse),
    messageCount: record._count?.messages ?? record.messages?.length,
  });
}

export function generateConversationTitle(question: string): string {
  const cleaned = question.trim().replace(/\s+/g, " ");
  if (cleaned.length <= 60) return cleaned;
  return `${cleaned.slice(0, 57)}...`;
}
