"use client";

import { motion } from "framer-motion";
import { ArrowRight, GitBranch } from "lucide-react";
import type { BuildOrderItem } from "@/types/roadmap";
import { Card, CardContent } from "@/components/ui/card";

interface BuildOrderSectionProps {
  items: BuildOrderItem[];
}

export function BuildOrderSection({ items }: BuildOrderSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Recommended Build Order
      </h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            <Card className="border-border bg-card transition-all hover:border-primary/20">
              <CardContent className="flex gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {item.rationale}
                  </p>
                  {item.dependsOn && item.dependsOn.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <GitBranch className="h-3.5 w-3.5 text-muted" />
                      <span className="text-xs text-muted">Depends on:</span>
                      {item.dependsOn.map((dep) => (
                        <span
                          key={dep}
                          className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs text-foreground"
                        >
                          {dep}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {index < items.length - 1 && (
                  <ArrowRight className="hidden h-4 w-4 shrink-0 self-center text-muted/40 sm:block" />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
