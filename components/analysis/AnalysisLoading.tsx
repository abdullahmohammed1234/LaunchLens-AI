"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SuccessScoreCard } from "./SuccessScoreCard";
import { TimelineBar } from "./TimelineBar";
import { RiskCard } from "./RiskCard";
import { SkillGapChart } from "./SkillGapChart";
import { MVPChecklist } from "./MVPChecklist";

const LOADING_MESSAGES = [
  "Analyzing project feasibility...",
  "Evaluating technical complexity...",
  "Identifying execution risks...",
  "Generating success prediction...",
] as const;

interface AnalysisLoadingProps {
  className?: string;
  fullPage?: boolean;
}

export function AnalysisLoading({
  className,
  fullPage = false,
}: AnalysisLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2800);

    return () => clearInterval(messageTimer);
  }, []);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 92) return prev;
        const increment = prev < 50 ? 2.5 : prev < 80 ? 1.2 : 0.4;
        return Math.min(prev + increment, 92);
      });
    }, 400);

    return () => clearInterval(progressTimer);
  }, []);

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="overflow-hidden border-border bg-card">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10"
            >
              <Brain className="h-8 w-8 text-primary" />
            </motion.div>

            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">
                AI Analysis in Progress
              </p>
            </div>

            <div className="relative mb-6 h-5 w-full max-w-md overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={messageIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm text-muted"
                >
                  {LOADING_MESSAGES[messageIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="w-full max-w-md">
              <div className="mb-2 flex justify-between text-xs text-muted">
                <span>Processing</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {fullPage && (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <SuccessScoreCard score={0} loading />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="border-border bg-card">
                  <CardContent className="flex flex-col items-center p-6">
                    <Skeleton className="h-8 w-20 rounded-full" />
                    <Skeleton className="mt-3 h-4 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="lg:col-span-1">
              <TimelineBar
                timeline={{ minMonths: 3, maxMonths: 6 }}
                loading
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-border bg-card">
              <CardContent className="space-y-3 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <RiskCard
                    key={i}
                    blocker={{
                      title: "",
                      description: "",
                      severity: "medium",
                    }}
                    loading
                  />
                ))}
              </CardContent>
            </Card>
            <SkillGapChart skillGaps={[]} loading />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <MVPChecklist items={[]} loading />
            <Card className="border-border bg-card">
              <CardContent className="space-y-3 p-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
