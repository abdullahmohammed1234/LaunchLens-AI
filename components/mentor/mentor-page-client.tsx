"use client";

import { useRouter } from "next/navigation";
import { MentorView } from "@/components/mentor/mentor-view";

interface MentorPageClientProps {
  projects: Array<{ id: string; title: string }>;
}

export function MentorPageClient({ projects }: MentorPageClientProps) {
  const router = useRouter();

  function handleProjectChange(projectId: string) {
    router.push(`/projects/${projectId}/mentor`);
  }

  return (
    <MentorView
      projects={projects}
      onProjectChange={handleProjectChange}
    />
  );
}
