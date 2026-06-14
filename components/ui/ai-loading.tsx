"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const AI_STATUS_MESSAGES = [
  "Initializing AI analysis engine...",
  "Evaluating market feasibility...",
  "Analyzing execution complexity...",
  "Modeling project risks...",
  "Identifying skill gaps...",
  "Generating strategic insights...",
  "Assessing investment readiness...",
  "Building recommendations...",
  "Finalizing intelligence report...",
];

interface AILoadingProps {
  title?: string;
  messages?: string[];
  className?: string;
}

export function AILoading({
  title = "AI Analysis in Progress",
  messages = AI_STATUS_MESSAGES,
  className,
}: AILoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-border bg-card px-8 py-16 text-center",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={title}
    >
      <div className="relative mb-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>

      <AnimatePresence mode="wait">
        <motion.p
          key={messageIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mb-6 text-sm text-muted"
        >
          {messages[messageIndex]}
        </motion.p>
      </AnimatePresence>

      <div className="flex items-center gap-2 text-xs text-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        <span>This usually takes 10–30 seconds</span>
      </div>

      <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-primary"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ width: "40%" }}
        />
      </div>
    </div>
  );
}

export function InlineAILoading({ message }: { message?: string }) {
  return (
    <div
      className="flex items-center gap-2 text-sm text-muted"
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span>{message ?? "Processing..."}</span>
    </div>
  );
}
