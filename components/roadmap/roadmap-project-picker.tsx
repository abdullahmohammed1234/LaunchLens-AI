"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoadmapView } from "@/components/roadmap/roadmap-view";
import type { StoredRoadmap } from "@/types/roadmap";

export interface RoadmapProjectOption {
  id: string;
  title: string;
  timeline: string;
  hasAnalysis: boolean;
  hasSimulation: boolean;
  roadmap: StoredRoadmap | null;
}

interface RoadmapProjectPickerProps {
  projects: RoadmapProjectOption[];
  defaultProjectId: string;
}

export function RoadmapProjectPicker({
  projects,
  defaultProjectId,
}: RoadmapProjectPickerProps) {
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

      <RoadmapView
        key={selected.id}
        projectId={selected.id}
        projectTitle={selected.title}
        projectTimeline={selected.timeline}
        hasAnalysis={selected.hasAnalysis}
        hasSimulation={selected.hasSimulation}
        initialRoadmap={selected.roadmap}
        showBackLink={false}
      />
    </div>
  );
}
