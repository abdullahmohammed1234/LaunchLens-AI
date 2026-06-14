import type { ProjectStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { statusVariant } from "@/lib/utils/project";

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant={statusVariant[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
