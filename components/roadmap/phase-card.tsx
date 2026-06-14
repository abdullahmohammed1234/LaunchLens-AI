"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PhaseTask {
  name: string;
  done: boolean;
}

interface PhaseCardProps {
  index: number;
  name: string;
  duration: string;
  status: "current" | "upcoming" | "completed";
  tasks: PhaseTask[];
}

export function PhaseCard({
  index,
  name,
  duration,
  status,
  tasks,
}: PhaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={`border-border bg-card ${
          status === "current" ? "border-primary/30" : ""
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                status === "current"
                  ? "bg-primary text-white"
                  : "bg-surface text-muted border border-border"
              }`}
            >
              {index + 1}
            </div>
            <div>
              <CardTitle className="text-base">{name}</CardTitle>
              <div className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                <Clock className="h-3 w-3" />
                {duration}
              </div>
            </div>
          </div>
          {status === "current" && <Badge variant="default">Current</Badge>}
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.name}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
              >
                {task.done ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-success" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-muted" />
                )}
                <span
                  className={`text-sm ${
                    task.done ? "text-muted line-through" : "text-foreground"
                  }`}
                >
                  {task.name}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
