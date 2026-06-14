"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { Blocker } from "@/lib/validations/analysis";
import { levelBorderClass, levelToBadgeVariant } from "@/lib/utils/analysis";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface RiskCardProps {
  blocker: Blocker;
  index?: number;
  loading?: boolean;
  className?: string;
}

export function RiskCard({
  blocker,
  index = 0,
  loading = false,
  className,
}: RiskCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          "rounded-lg border border-border bg-surface/50 p-4",
          className
        )}
      >
        <div className="mb-2 flex items-center justify-between">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="mt-2 h-3 w-4/5" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-lg border bg-surface/50 p-4 transition-all duration-200",
        levelBorderClass(blocker.severity),
        className
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <AlertTriangle
            className={cn(
              "mt-0.5 h-4 w-4 shrink-0",
              blocker.severity === "high"
                ? "text-danger"
                : blocker.severity === "medium"
                  ? "text-warning"
                  : "text-success"
            )}
          />
          <p className="text-sm font-medium text-foreground">{blocker.title}</p>
        </div>
        <Badge variant={levelToBadgeVariant(blocker.severity)}>
          {blocker.severity}
        </Badge>
      </div>
      <p className="pl-6 text-xs leading-relaxed text-muted">
        {blocker.description}
      </p>
    </motion.div>
  );
}
