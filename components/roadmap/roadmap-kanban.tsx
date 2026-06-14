"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical } from "lucide-react";
import type { KanbanColumn, KanbanTask, Roadmap } from "@/types/roadmap";
import { priorityBadgeVariant } from "@/lib/utils/roadmap";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const COLUMNS: { id: KanbanColumn; label: string; color: string }[] = [
  { id: "backlog", label: "Backlog", color: "border-t-muted" },
  { id: "in_progress", label: "In Progress", color: "border-t-primary" },
  { id: "ready", label: "Ready", color: "border-t-warning" },
  { id: "completed", label: "Completed", color: "border-t-success" },
];

interface RoadmapKanbanProps {
  roadmap: Roadmap;
}

function buildInitialTasks(roadmap: Roadmap): KanbanTask[] {
  return roadmap.phases.flatMap((phase, phaseIndex) =>
    phase.tasks.map((task, taskIndex) => ({
      ...task,
      id: `${phaseIndex}-${taskIndex}`,
      phaseIndex,
      taskIndex,
      column: "backlog" as KanbanColumn,
    }))
  );
}

export function RoadmapKanban({ roadmap }: RoadmapKanbanProps) {
  const [tasks, setTasks] = useState<KanbanTask[]>(() =>
    buildInitialTasks(roadmap)
  );
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const tasksByColumn = useMemo(() => {
    const grouped: Record<KanbanColumn, KanbanTask[]> = {
      backlog: [],
      in_progress: [],
      ready: [],
      completed: [],
    };
    for (const task of tasks) {
      grouped[task.column].push(task);
    }
    return grouped;
  }, [tasks]);

  function handleDragStart(taskId: string) {
    setDraggedId(taskId);
  }

  function handleDrop(column: KanbanColumn) {
    if (!draggedId) return;
    setTasks((prev) =>
      prev.map((t) => (t.id === draggedId ? { ...t, column } : t))
    );
    setDraggedId(null);
  }

  function moveTask(taskId: string, column: KanbanColumn) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, column } : t))
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Execution Kanban
      </h2>
      <div className="grid gap-4 lg:grid-cols-4">
        {COLUMNS.map((column, colIndex) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.06 }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(column.id)}
          >
            <Card
              className={cn(
                "border-border bg-card border-t-2",
                column.color
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-sm">
                  {column.label}
                  <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-normal text-muted">
                    {tasksByColumn[column.id].length}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <AnimatePresence mode="popLayout">
                  {tasksByColumn[column.id].map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className={cn(
                        "cursor-grab rounded-lg border border-border bg-surface/50 p-3 active:cursor-grabbing",
                        draggedId === task.id && "opacity-50"
                      )}
                    >
                      <div className="mb-2 flex items-start gap-2">
                        <GripVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted/50" />
                        <p className="flex-1 text-sm font-medium leading-snug text-foreground">
                          {task.title}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={priorityBadgeVariant(task.priority)}>
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-muted">
                          {task.estimatedHours}h
                        </span>
                      </div>
                      {column.id !== "completed" && (
                        <button
                          type="button"
                          onClick={() => {
                            const nextCol =
                              column.id === "backlog"
                                ? "in_progress"
                                : column.id === "in_progress"
                                  ? "ready"
                                  : "completed";
                            moveTask(task.id, nextCol);
                          }}
                          className="mt-2 w-full rounded border border-border bg-card py-1 text-xs text-muted transition-colors hover:text-foreground"
                        >
                          Move forward →
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {tasksByColumn[column.id].length === 0 && (
                  <p className="py-6 text-center text-xs text-muted/60">
                    Drop tasks here
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
