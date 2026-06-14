"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FailureSimulatorView } from "@/components/simulator/failure-simulator-view";
import type { StoredFailureSimulation } from "@/types/failure-simulation";

export interface SimulatorProjectOption {
  id: string;
  title: string;
  hasAnalysis: boolean;
  simulation: StoredFailureSimulation | null;
}

interface SimulatorProjectPickerProps {
  projects: SimulatorProjectOption[];
  defaultProjectId: string;
}

export function SimulatorProjectPicker({
  projects,
  defaultProjectId,
}: SimulatorProjectPickerProps) {
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

      <FailureSimulatorView
        key={selected.id}
        projectId={selected.id}
        projectTitle={selected.title}
        hasAnalysis={selected.hasAnalysis}
        initialSimulation={selected.simulation}
        showBackLink={false}
      />
    </div>
  );
}
