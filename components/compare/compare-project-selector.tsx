"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export interface CompareProjectOption {
  id: string;
  title: string;
  hasAnalysis: boolean;
  hasSimulation: boolean;
  hasRoadmap: boolean;
  hasTeamPlan: boolean;
  successScore: number | null;
}

interface CompareProjectSelectorProps {
  projects: CompareProjectOption[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onCompare: () => void;
  isLoading?: boolean;
}

const MIN_SELECTION = 2;
const MAX_SELECTION = 5;

export function CompareProjectSelector({
  projects,
  selectedIds,
  onSelectionChange,
  onCompare,
  isLoading = false,
}: CompareProjectSelectorProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter((p) => p.title.toLowerCase().includes(query));
  }, [projects, search]);

  const analyzableProjects = projects.filter((p) => p.hasAnalysis);

  function toggleProject(id: string) {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((sid) => sid !== id));
      return;
    }
    if (selectedIds.length >= MAX_SELECTION) return;
    onSelectionChange([...selectedIds, id]);
  }

  function removeProject(id: string) {
    onSelectionChange(selectedIds.filter((sid) => sid !== id));
  }

  const canCompare =
    selectedIds.length >= MIN_SELECTION &&
    selectedIds.length <= MAX_SELECTION &&
    !isLoading;

  return (
    <Card className="border-border bg-card">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Select Projects to Compare
            </h3>
            <p className="mt-1 text-xs text-muted">
              Choose {MIN_SELECTION}–{MAX_SELECTION} analyzed projects
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 flex flex-wrap gap-2"
            >
              {selectedIds.map((id) => {
                const project = projects.find((p) => p.id === id);
                if (!project) return null;
                return (
                  <Badge
                    key={id}
                    variant="default"
                    className="gap-1.5 py-1 pl-3 pr-1.5"
                  >
                    {project.title}
                    <button
                      type="button"
                      onClick={() => removeProject(id)}
                      className="rounded-full p-0.5 hover:bg-primary/20"
                      aria-label={`Remove ${project.title}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => {
            const isSelected = selectedIds.includes(project.id);
            const isDisabled =
              !project.hasAnalysis ||
              (!isSelected && selectedIds.length >= MAX_SELECTION);

            return (
              <motion.button
                key={project.id}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => !isDisabled && toggleProject(project.id)}
                disabled={isDisabled}
                className={cn(
                  "group relative flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-border bg-surface/50 hover:border-primary/30 hover:bg-card",
                  isDisabled && !isSelected && "cursor-not-allowed opacity-50"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-border bg-card group-hover:border-primary/50"
                  )}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">
                    {project.title}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {!project.hasAnalysis && (
                      <Badge variant="warning" className="text-[10px]">
                        Needs analysis
                      </Badge>
                    )}
                    {project.hasSimulation && (
                      <Badge variant="secondary" className="text-[10px]">
                        Simulated
                      </Badge>
                    )}
                    {project.hasRoadmap && (
                      <Badge variant="secondary" className="text-[10px]">
                        Roadmap
                      </Badge>
                    )}
                    {project.hasTeamPlan && (
                      <Badge variant="secondary" className="text-[10px]">
                        Team
                      </Badge>
                    )}
                  </div>
                  {project.successScore !== null && (
                    <p className="mt-1 text-xs text-muted">
                      Success score: {project.successScore}%
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {analyzableProjects.length < MIN_SELECTION && (
          <p className="mt-4 text-sm text-warning">
            You need at least {MIN_SELECTION} analyzed projects to compare. Run
            analysis on your project ideas first.
          </p>
        )}

        <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
          <p className="text-xs text-muted">
            {selectedIds.length} of {MAX_SELECTION} selected
          </p>
          <Button onClick={onCompare} disabled={!canCompare}>
            Compare Projects
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
