"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Code2,
  Users,
  Target,
  Layers,
  AlertCircle,
} from "lucide-react";
import type { RootCause } from "@/types/failure-simulation";
import {
  levelToBadgeVariant,
  levelBorderClass,
} from "@/lib/utils/analysis";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RootCauseAnalysisProps {
  rootCauses: RootCause[];
}

const ICONS = [Code2, Target, Users, Layers, AlertCircle];

function RootCauseItem({
  cause,
  index,
}: {
  cause: RootCause;
  index: number;
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const Icon = ICONS[index % ICONS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={cn(
        "rounded-lg border bg-surface/50 transition-all duration-200",
        levelBorderClass(cause.severity)
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="flex w-full items-start gap-3 p-4 text-left"
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
            cause.severity === "high"
              ? "bg-danger/10 text-danger"
              : cause.severity === "medium"
                ? "bg-warning/10 text-warning"
                : "bg-success/10 text-success"
          )}
        >
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium text-foreground">{cause.title}</p>
            <div className="flex shrink-0 items-center gap-2">
              <Badge variant={levelToBadgeVariant(cause.severity)}>
                {cause.severity}
              </Badge>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-muted transition-transform duration-200",
                  expanded && "rotate-180"
                )}
              />
            </div>
          </div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="border-t border-border/50 px-4 py-3 pl-[4.25rem] text-xs leading-relaxed text-muted">
              {cause.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function RootCauseAnalysis({ rootCauses }: RootCauseAnalysisProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Root Cause Analysis</CardTitle>
        <p className="text-sm text-muted">
          Underlying factors driving this failure path
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {rootCauses.map((cause, index) => (
          <RootCauseItem key={cause.title} cause={cause} index={index} />
        ))}
      </CardContent>
    </Card>
  );
}
