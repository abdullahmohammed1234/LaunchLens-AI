"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReportView } from "@/components/reports/report-view";
import type { StoredExecutiveReport } from "@/types/executive-report";

export interface ReportProjectOption {
  id: string;
  title: string;
  hasAnalysis: boolean;
  hasSimulation: boolean;
  hasRoadmap: boolean;
  hasTeamPlan: boolean;
  latestReport: StoredExecutiveReport | null;
  reportHistory: StoredExecutiveReport[];
}

interface ReportProjectPickerProps {
  projects: ReportProjectOption[];
  defaultProjectId: string;
}

export function ReportProjectPicker({
  projects,
  defaultProjectId,
}: ReportProjectPickerProps) {
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

      <ReportView
        key={selected.id}
        projectId={selected.id}
        projectTitle={selected.title}
        hasAnalysis={selected.hasAnalysis}
        hasSimulation={selected.hasSimulation}
        hasRoadmap={selected.hasRoadmap}
        hasTeamPlan={selected.hasTeamPlan}
        initialReport={selected.latestReport}
        reportHistory={selected.reportHistory}
        showBackLink={false}
      />
    </div>
  );
}
