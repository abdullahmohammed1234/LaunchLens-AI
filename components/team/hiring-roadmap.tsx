"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import type { HiringOrderItem } from "@/types/team-plan";
import {
  priorityAccentClass,
  priorityToBadgeVariant,
} from "@/lib/utils/team-plan";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface HiringRoadmapProps {
  items: HiringOrderItem[];
}

export function HiringRoadmap({ items }: HiringRoadmapProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Hiring Roadmap</h2>
      <div className="relative">
        <div className="absolute left-[1.65rem] top-8 hidden h-[calc(100%-4rem)] w-px bg-border sm:block" />

        <div className="space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <Card className="border-border bg-card transition-all hover:border-primary/20">
                <CardContent className="flex gap-4 p-4">
                  <div className="relative flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    {index < items.length - 1 && (
                      <ArrowRight className="absolute -right-6 top-3 hidden h-4 w-4 text-muted/40 sm:block" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">
                        {item.title}
                      </p>
                      <Badge variant={priorityToBadgeVariant(item.priority)}>
                        <span className={priorityAccentClass(item.priority)}>
                          {item.priority}
                        </span>
                      </Badge>
                    </div>

                    <div className="mb-2 flex items-center gap-1.5 text-xs text-muted">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{item.timing}</span>
                    </div>

                    <p className="text-sm leading-relaxed text-muted">
                      {item.rationale}
                    </p>
                  </div>

                  <Calendar className="hidden h-4 w-4 shrink-0 self-start text-muted/40 lg:block" />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
