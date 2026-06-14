"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Target, Trash2 } from "lucide-react";
import type { GoalEntry } from "@/types/portfolio";
import {
  createGoalAction,
  deleteGoalAction,
} from "@/lib/actions/portfolio";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GoalsTrackerProps {
  goals: GoalEntry[];
  projectOptions?: { id: string; title: string }[];
}

export function GoalsTracker({ goals, projectOptions = [] }: GoalsTrackerProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"readiness_score" | "risk_reduction" | "launch_mvp" | "custom">("readiness_score");
  const [targetValue, setTargetValue] = useState("80");
  const [projectId, setProjectId] = useState<string>("");

  async function handleCreate() {
    if (!title.trim()) return;
    await createGoalAction({
      title: title.trim(),
      type,
      targetValue: type !== "custom" ? Number(targetValue) : undefined,
      projectId: projectId || undefined,
    });
    setTitle("");
    setOpen(false);
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Goals</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Input
                placeholder="e.g. Reach 80 readiness score"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="readiness_score">Readiness Score</SelectItem>
                  <SelectItem value="risk_reduction">Risk Reduction</SelectItem>
                  <SelectItem value="launch_mvp">Launch MVP</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
              {type !== "custom" && (
                <Input
                  type="number"
                  placeholder="Target value"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                />
              )}
              {projectOptions.length > 0 && (
                <Select
                  value={projectId || "__none__"}
                  onValueChange={(v) =>
                    setProjectId(v === "__none__" ? "" : v)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link to project (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">No project</SelectItem>
                    {projectOptions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button onClick={handleCreate} className="w-full">
                Create Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-3">
        {goals.length === 0 ? (
          <div className="flex h-28 items-center justify-center">
            <div className="text-center">
              <Target className="mx-auto mb-2 h-8 w-8 text-muted/40" />
              <p className="text-sm text-muted">Set goals to track progress</p>
            </div>
          </div>
        ) : (
          goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-lg border border-border bg-surface p-4"
            >
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {goal.title}
                  </p>
                  {goal.projectTitle && (
                    <p className="text-xs text-muted">{goal.projectTitle}</p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted hover:text-danger"
                  onClick={() => deleteGoalAction(goal.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted">
                  <span>Progress</span>
                  <span>
                    {goal.currentValue}
                    {goal.targetValue ? ` / ${goal.targetValue}` : ""}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-border">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${goal.progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
