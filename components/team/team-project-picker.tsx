"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamView } from "@/components/team/team-view";
import type { StoredTeamPlan } from "@/types/team-plan";

export interface TeamProjectOption {
  id: string;
  title: string;
  hasAnalysis: boolean;
  hasSimulation: boolean;
  hasRoadmap: boolean;
  teamPlan: StoredTeamPlan | null;
}

interface TeamProjectPickerProps {
  projects: TeamProjectOption[];
  defaultProjectId: string;
}

export function TeamProjectPicker({
  projects,
  defaultProjectId,
}: TeamProjectPickerProps) {
  const [selectedId, setSelectedId] = useState(defaultProjectId);
  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  if (!selected) return null;

  return (
    <div className="space-y-6">
      <div className="max-w-md space-y-2">
        <label className="text-sm font-medium text-foreground">Project</label>
        <Select value={selectedId} onValueChange={setSelectedId}>
          <SelectTrigger>
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
                {!project.hasAnalysis && " (needs analysis)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <TeamView
        key={selected.id}
        projectId={selected.id}
        projectTitle={selected.title}
        hasAnalysis={selected.hasAnalysis}
        hasSimulation={selected.hasSimulation}
        hasRoadmap={selected.hasRoadmap}
        initialTeamPlan={selected.teamPlan}
        showBackLink={false}
      />
    </div>
  );
}
