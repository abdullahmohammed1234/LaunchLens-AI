"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle } from "lucide-react";
import type { LaunchChecklistItem } from "@/types/roadmap";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LaunchChecklistProps {
  items: LaunchChecklistItem[];
}

export function LaunchChecklist({ items }: LaunchChecklistProps) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(index: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  const progress = Math.round((checked.size / items.length) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          Launch Checklist
        </h2>
        <span className="text-sm text-muted">
          {checked.size}/{items.length} ready
        </span>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted">
            Launch Readiness
          </CardTitle>
          <div className="mt-2">
            <div className="mb-1 flex justify-between text-xs text-muted">
              <span>Pre-launch completion</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-border/60">
              <motion.div
                className="h-full rounded-full bg-success"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {items.map((item, index) => {
            const isChecked = checked.has(index);
            return (
              <motion.button
                key={item.title}
                type="button"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => toggle(index)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-lg border border-border p-3 text-left transition-all hover:border-primary/30",
                  isChecked ? "bg-success/5 border-success/20" : "bg-surface/30"
                )}
              >
                {isChecked ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted" />
                )}
                <div>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      isChecked
                        ? "text-muted line-through"
                        : "text-foreground"
                    )}
                  >
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{item.description}</p>
                </div>
              </motion.button>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
