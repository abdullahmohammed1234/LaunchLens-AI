"use client";

import { motion } from "framer-motion";
import { Brain, User } from "lucide-react";
import { MarkdownContent } from "@/components/mentor/markdown-content";
import { MentorActions } from "@/components/mentor/mentor-actions";
import { MentorImprovementPlan } from "@/components/mentor/mentor-improvement-plan";
import { MentorSources } from "@/components/mentor/mentor-sources";
import { MentorWhatIf } from "@/components/mentor/mentor-what-if";
import type { MentorResponse } from "@/types/mentor";
import { cn } from "@/lib/utils/cn";

interface MentorMessageProps {
  role: "user" | "assistant";
  content: string;
  responseData?: MentorResponse | null;
  index?: number;
}

export function MentorMessage({
  role,
  content,
  responseData,
  index = 0,
}: MentorMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.02 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isUser ? "bg-surface" : "bg-primary/10"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-muted" />
        ) : (
          <Brain className="h-4 w-4 text-primary" />
        )}
      </div>

      <div
        className={cn(
          "min-w-0 max-w-[85%] space-y-4",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3",
            isUser
              ? "rounded-tr-md bg-primary text-primary-foreground"
              : "rounded-tl-md border border-border bg-card"
          )}
        >
          {isUser ? (
            <p className="text-sm leading-relaxed">{content}</p>
          ) : (
            <MarkdownContent content={content} />
          )}
        </div>

        {!isUser && responseData && (
          <div className="space-y-4 pl-1">
            <MentorSources
              sources={responseData.sources}
              confidence={responseData.confidence}
            />
            <MentorActions actions={responseData.recommendedActions} />
            {responseData.whatIfComparisons && (
              <MentorWhatIf comparisons={responseData.whatIfComparisons} />
            )}
            {responseData.improvementPlan && (
              <MentorImprovementPlan steps={responseData.improvementPlan} />
            )}
            {responseData.relatedInsights.length > 0 && (
              <div className="rounded-lg border border-border/60 bg-surface/30 p-3">
                <p className="mb-2 text-xs font-medium text-muted">
                  Related insights
                </p>
                <ul className="space-y-1.5">
                  {responseData.relatedInsights.map((insight, i) => (
                    <li key={i} className="text-xs text-foreground/80">
                      <span className="font-medium">{insight.title}: </span>
                      {insight.insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
