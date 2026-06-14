"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Hammer } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MVPChecklistProps {
  items: string[];
  loading?: boolean;
  index?: number;
  className?: string;
}

export function MVPChecklist({
  items,
  loading = false,
  index = 0,
  className,
}: MVPChecklistProps) {
  if (loading) {
    return (
      <Card className={cn("border-border bg-card", className)}>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
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
            <Hammer className="h-4 w-4 text-primary" />
            MVP Build Order
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + i * 0.06 }}
                className="relative flex gap-4 pb-6 last:pb-0"
              >
                {i < items.length - 1 && (
                  <div className="absolute left-4 top-8 h-[calc(100%-1rem)] w-px bg-border" />
                )}
                <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1 pt-1">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success/70" />
                    <p className="text-sm leading-relaxed text-muted">{item}</p>
                  </div>
                  {i === 0 && (
                    <span className="mt-2 inline-block rounded-full border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
                      Start here
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
