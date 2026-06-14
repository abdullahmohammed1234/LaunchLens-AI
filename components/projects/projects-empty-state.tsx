"use client";

import { EMPTY_STATES } from "@/lib/constants/empty-states";
import { EmptyState } from "@/components/ui/empty-state";

const config = EMPTY_STATES.projects;

export function ProjectsEmptyState() {
  return (
    <EmptyState
      icon={config.icon}
      title={config.title}
      description={config.description}
      action={{
        label: config.actionLabel,
        href: config.actionHref,
      }}
      secondaryAction={config.secondaryAction}
    />
  );
}
