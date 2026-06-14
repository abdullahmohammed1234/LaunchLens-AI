"use client";

import { motion } from "framer-motion";
import { CalendarRange } from "lucide-react";
import type { ProjectAnalysis } from "@/lib/validations/analysis";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TimelineBarProps {
  timeline: ProjectAnalysis["estimatedTimeline"];
  loading?: boolean;
  index?: number;
  className?: string;
}

export function TimelineBar({
  timeline,
  loading = false,
  index = 0,
  className,
}: TimelineBarProps) {
  const { minMonths, maxMonths } = timeline;
  const maxScale = Math.max(maxMonths + 2, 12);
  const minPercent = (minMonths / maxScale) * 100;
  const maxPercent = (maxMonths / maxScale) * 100;
  const rangeWidth = maxPercent - minPercent;

  if (loading) {
    return (
      <Card className={cn("border-border bg-card", className)}>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-3 w-full rounded-full" />
          <div className="mt-4 flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card
        className={cn(
          "border-border bg-card transition-all duration-300 hover:border-primary/20",
          className
        )}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarRange className="h-4 w-4 text-primary" />
            Estimated Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6 h-3 w-full overflow-hidden rounded-full bg-border/60">
            <motion.div
              className="absolute top-0 h-full rounded-full bg-gradient-to-r from-primary/60 via-primary to-primary/80"
              initial={{ left: "0%", width: "0%" }}
              animate={{ left: `${minPercent}%`, width: `${rangeWidth}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            />
            <div
              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow-md"
              style={{ left: `calc(${minPercent}% - 8px)` }}
            />
            <div
              className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-primary bg-card shadow-md"
              style={{ left: `calc(${maxPercent}% - 8px)` }}
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <div>
              <p className="text-xs text-muted">Minimum</p>
              <p className="font-semibold text-foreground">
                {minMonths} mo{minMonths !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted">Range</p>
              <p className="font-semibold text-primary">
                {minMonths === maxMonths
                  ? `${minMonths} mo${minMonths !== 1 ? "s" : ""}`
                  : `${minMonths}–${maxMonths} mos`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted">Maximum</p>
              <p className="font-semibold text-foreground">
                {maxMonths} mo{maxMonths !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted">
            Uncertainty range reflects scope, team experience, and technical
            complexity factors.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
