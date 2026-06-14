import type { PortfolioFilter, PortfolioProject } from "@/types/portfolio";
import { riskLevelToScore } from "@/lib/portfolio/utils";

export function filterPortfolioProjects(
  projects: PortfolioProject[],
  filter: PortfolioFilter
): PortfolioProject[] {
  let result = [...projects];

  if (filter.search?.trim()) {
    const q = filter.search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (filter.status && filter.status !== "all") {
    result = result.filter((p) => p.status === filter.status);
  }

  if (filter.riskLevel && filter.riskLevel !== "all") {
    result = result.filter((p) => p.riskLevel === filter.riskLevel);
  }

  if (filter.minSuccessScore !== undefined) {
    result = result.filter(
      (p) => p.successScore !== null && p.successScore >= filter.minSuccessScore!
    );
  }

  if (filter.maxSuccessScore !== undefined) {
    result = result.filter(
      (p) => p.successScore !== null && p.successScore <= filter.maxSuccessScore!
    );
  }

  if (filter.minReadiness !== undefined) {
    result = result.filter(
      (p) =>
        p.readinessScore !== null && p.readinessScore >= filter.minReadiness!
    );
  }

  if (filter.maxReadiness !== undefined) {
    result = result.filter(
      (p) =>
        p.readinessScore !== null && p.readinessScore <= filter.maxReadiness!
    );
  }

  if (filter.starredOnly) {
    result = result.filter((p) => p.isStarred);
  }

  if (filter.pinnedOnly) {
    result = result.filter((p) => p.isPinned);
  }

  const sortBy = filter.sortBy ?? "updatedAt";
  const sortOrder = filter.sortOrder ?? "desc";
  const dir = sortOrder === "asc" ? 1 : -1;

  result.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

    switch (sortBy) {
      case "title":
        return dir * a.title.localeCompare(b.title);
      case "successScore":
        return dir * ((a.successScore ?? -1) - (b.successScore ?? -1));
      case "readinessScore":
        return dir * ((a.readinessScore ?? -1) - (b.readinessScore ?? -1));
      case "riskLevel":
        return (
          dir *
          (riskLevelToScore(a.riskLevel) - riskLevelToScore(b.riskLevel))
        );
      case "createdAt":
        return (
          dir *
          (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        );
      case "updatedAt":
      default:
        return (
          dir *
          (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        );
    }
  });

  return result;
}
