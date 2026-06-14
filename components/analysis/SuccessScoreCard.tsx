"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useAnimatedNumber } from "@/lib/hooks/use-animated-number";
import {
  successScoreColor,
  successScoreLabel,
} from "@/lib/utils/analysis";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SuccessScoreCardProps {
  score: number;
  loading?: boolean;
  index?: number;
  className?: string;
}

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function SuccessScoreCard({
  score,
  loading = false,
  index = 0,
  className,
}: SuccessScoreCardProps) {
  const animatedScore = useAnimatedNumber(score, 1.4, !loading);
  const strokeOffset =
    CIRCUMFERENCE - (animatedScore / 100) * CIRCUMFERENCE;

  if (loading) {
    return (
      <Card className={cn("border-border bg-card", className)}>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Skeleton className="h-36 w-36 rounded-full" />
          <Skeleton className="mt-4 h-4 w-24" />
          <Skeleton className="mt-2 h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <Card
        className={cn(
          "group border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
          className
        )}
      >
        <CardContent className="flex flex-col items-center justify-center p-8">
          <div className="relative">
            <svg
              className="-rotate-90"
              width="140"
              height="140"
              viewBox="0 0 140 140"
            >
              <circle
                cx="70"
                cy="70"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-border"
              />
              <motion.circle
                cx="70"
                cy="70"
                r={RADIUS}
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className={successScoreColor(score)}
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: strokeOffset }}
                transition={{ duration: 1.4, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className={cn(
                  "text-4xl font-bold tracking-tight",
                  successScoreColor(score)
                )}
              >
                {animatedScore}
              </span>
              <span className="text-xs text-muted">/ 100</span>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Success Score</p>
          </div>
          <p className="mt-1 text-xs text-muted">{successScoreLabel(score)}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
