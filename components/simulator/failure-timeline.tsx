"use client";

import { motion } from "framer-motion";
import { Check, AlertTriangle, XCircle } from "lucide-react";
import type { FailureScenario } from "@/types/failure-simulation";
import { inferTimelineSeverity } from "@/lib/utils/failure-simulation";
import { cn } from "@/lib/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FailureTimelineProps {
  scenario: FailureScenario;
}

function TimelineIcon({
  severity,
}: {
  severity: "neutral" | "warning" | "critical";
}) {
  switch (severity) {
    case "critical":
      return <XCircle className="h-4 w-4 text-danger" />;
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-warning" />;
    default:
      return <Check className="h-4 w-4 text-success" />;
  }
}

function timelineLineClass(severity: "neutral" | "warning" | "critical") {
  switch (severity) {
    case "critical":
      return "bg-danger/60";
    case "warning":
      return "bg-warning/60";
    default:
      return "bg-success/40";
  }
}

export function FailureTimeline({ scenario }: FailureTimelineProps) {
  const events = scenario.timeline;

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-base">Failure Timeline</CardTitle>
        <p className="text-sm text-muted">
          How {scenario.title.toLowerCase()} unfolds month by month
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative ml-2">
          {events.map((event, index) => {
            const severity = inferTimelineSeverity(
              event,
              index,
              events.length
            );
            const isLast = index === events.length - 1;

            return (
              <motion.div
                key={`${event.month}-${index}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative flex gap-4 pb-8 last:pb-0"
              >
                {!isLast && (
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 + 0.15 }}
                    className={cn(
                      "absolute left-[11px] top-6 h-[calc(100%-12px)] w-0.5 origin-top",
                      timelineLineClass(severity)
                    )}
                  />
                )}

                <div
                  className={cn(
                    "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 bg-card",
                    severity === "critical"
                      ? "border-danger/50"
                      : severity === "warning"
                        ? "border-warning/50"
                        : "border-success/40"
                  )}
                >
                  <TimelineIcon severity={severity} />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Month {event.month}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    {event.event}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {event.impact}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
