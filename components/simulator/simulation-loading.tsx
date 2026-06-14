"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FlaskConical, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LOADING_MESSAGES = [
  "Modeling project risks...",
  "Exploring failure paths...",
  "Evaluating timeline vulnerabilities...",
  "Generating mitigation strategies...",
] as const;

interface SimulationLoadingProps {
  className?: string;
  fullPage?: boolean;
}

export function SimulationLoading({
  className,
  fullPage = false,
}: SimulationLoadingProps) {
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
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10"
            >
              <FlaskConical className="h-8 w-8 text-danger" />
            </motion.div>

            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">
                Failure Simulation in Progress
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
                <span>Simulating</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-danger/70 to-primary"
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-border bg-card">
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-4 h-8 w-16" />
                  <Skeleton className="mt-2 h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="border-border bg-card">
                <CardContent className="p-6">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="mt-3 h-8 w-20" />
                  <Skeleton className="mt-4 h-12 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border bg-card">
            <CardContent className="space-y-6 p-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
