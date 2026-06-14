"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MentorConversationSidebar } from "@/components/mentor/mentor-conversation-sidebar";
import { MentorLoading } from "@/components/mentor/mentor-loading";
import { MentorMessage } from "@/components/mentor/mentor-message";
import { MentorSuggestions } from "@/components/mentor/mentor-suggestions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FOUNDER_COACH_SUGGESTIONS,
  PORTFOLIO_MENTOR_SUGGESTIONS,
  PROJECT_MENTOR_SUGGESTIONS,
  WHAT_IF_SUGGESTIONS,
  mentorResponseSchema,
  type MentorMode,
  type StoredMentorConversation,
  type StoredMentorMessage,
} from "@/types/mentor";

interface MentorViewProps {
  projectId?: string;
  projectTitle?: string;
  initialMode?: MentorMode;
  hasAnalysis?: boolean;
  projects?: Array<{ id: string; title: string }>;
  onProjectChange?: (projectId: string) => void;
}

const MODE_LABELS: Record<MentorMode, string> = {
  project: "Strategic Advisor",
  portfolio: "Portfolio Mentor",
  founder_coach: "Founder Coach",
};

export function MentorView({
  projectId,
  projectTitle,
  initialMode = "project",
  hasAnalysis = true,
  projects,
  onProjectChange,
}: MentorViewProps) {
  const [mode, setMode] = useState<MentorMode>(
    projectId ? initialMode : "portfolio"
  );
  const [messages, setMessages] = useState<StoredMentorMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  const effectiveMode: MentorMode = projectId
    ? mode
    : mode === "founder_coach"
      ? "founder_coach"
      : "portfolio";

  const suggestions =
    effectiveMode === "portfolio"
      ? [...PORTFOLIO_MENTOR_SUGGESTIONS, ...WHAT_IF_SUGGESTIONS.slice(0, 2)]
      : effectiveMode === "founder_coach"
        ? [...FOUNDER_COACH_SUGGESTIONS, ...PROJECT_MENTOR_SUGGESTIONS.slice(0, 2)]
        : [...PROJECT_MENTOR_SUGGESTIONS, ...WHAT_IF_SUGGESTIONS];

  async function sendMessage(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    if (effectiveMode !== "portfolio" && !projectId) {
      toast.error("Select a project first");
      return;
    }

    if (effectiveMode !== "portfolio" && !hasAnalysis) {
      toast.error("Run project analysis first to unlock contextual guidance");
      return;
    }

    setInput("");
    setIsLoading(true);

    const optimisticUserMessage: StoredMentorMessage = {
      id: `temp-user-${Date.now()}`,
      conversationId: conversationId ?? "temp",
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUserMessage]);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          projectId: effectiveMode === "portfolio" ? undefined : projectId,
          conversationId: conversationId ?? undefined,
          mode: effectiveMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to get mentor response");
      }

      if (data.response) {
        mentorResponseSchema.parse(data.response);
      }

      setConversationId(data.conversation.id);

      setMessages((prev) => {
        const withoutOptimistic = prev.filter(
          (m) => m.id !== optimisticUserMessage.id
        );
        return [
          ...withoutOptimistic,
          data.userMessage,
          data.assistantMessage,
        ];
      });
    } catch (error) {
      setMessages((prev) =>
        prev.filter((m) => m.id !== optimisticUserMessage.id)
      );
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }

  async function loadConversation(conversation: StoredMentorConversation) {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/mentor/conversations/${conversation.id}`
      );
      if (!response.ok) throw new Error("Failed to load conversation");

      const data = await response.json();
      setConversationId(data.conversation.id);
      setMessages(data.conversation.messages ?? []);
      if (data.conversation.mode) {
        setMode(data.conversation.mode);
      }
    } catch {
      toast.error("Failed to load conversation");
    } finally {
      setIsLoading(false);
    }
  }

  function handleNewConversation() {
    setConversationId(null);
    setMessages([]);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const showEmptyState = messages.length === 0 && !isLoading;

  return (
    <div className="flex h-[calc(100vh-12rem)] min-h-[600px] gap-4">
      <MentorConversationSidebar
        projectId={projectId}
        activeConversationId={conversationId}
        onSelectConversation={loadConversation}
        onNewConversation={handleNewConversation}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-foreground">
                  {MODE_LABELS[effectiveMode]}
                </h2>
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI Mentor
                </Badge>
              </div>
              {projectTitle && (
                <p className="text-xs text-muted">{projectTitle}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {projects && projects.length > 1 && onProjectChange && (
              <select
                value={projectId}
                onChange={(e) => onProjectChange(e.target.value)}
                className="h-9 rounded-lg border border-border bg-surface px-3 text-xs text-foreground"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}

            {projectId && (
              <Tabs
                value={mode}
                onValueChange={(v) => setMode(v as MentorMode)}
              >
                <TabsList className="h-9">
                  <TabsTrigger value="project" className="text-xs">
                    Advisor
                  </TabsTrigger>
                  <TabsTrigger value="founder_coach" className="text-xs">
                    Coach
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          {showEmptyState ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-2xl space-y-8"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <Brain className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  How can I help you decide?
                </h3>
                <p className="mt-2 text-sm text-muted">
                  Ask about risks, priorities, team gaps, or what-if scenarios.
                  I&apos;ll answer using your LaunchLens intelligence — not
                  generic advice.
                </p>
                {!hasAnalysis && projectId && (
                  <p className="mt-3 text-xs text-warning">
                    Run analysis first for the most contextual guidance.
                  </p>
                )}
              </div>

              <MentorSuggestions
                suggestions={suggestions}
                onSelect={sendMessage}
                disabled={isLoading}
              />
            </motion.div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((message, index) => (
                <MentorMessage
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  responseData={message.responseData}
                  index={index}
                />
              ))}
              {isLoading && <MentorLoading compact />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="mx-auto flex max-w-3xl gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI mentor anything about strategy, execution, or priorities..."
              className="min-h-[52px] max-h-32 resize-none py-3"
              disabled={isLoading}
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[52px] w-[52px] shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] text-muted">
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
