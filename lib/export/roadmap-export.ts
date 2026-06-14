import type { StoredRoadmap } from "@/types/roadmap";

export interface RoadmapExportData {
  title: string;
  generatedAt: string;
  estimatedDurationMonths: number;
  phases: StoredRoadmap["phases"];
  launchChecklist: StoredRoadmap["launchChecklist"];
  criticalSuccessFactors: StoredRoadmap["criticalSuccessFactors"];
  recommendedBuildOrder: StoredRoadmap["recommendedBuildOrder"];
  planComparison: StoredRoadmap["planComparison"];
}

export function buildRoadmapExportData(
  roadmap: StoredRoadmap,
  projectTitle: string
): RoadmapExportData {
  return {
    title: `${projectTitle} — Execution Roadmap`,
    generatedAt: roadmap.createdAt,
    estimatedDurationMonths: roadmap.estimatedDurationMonths,
    phases: roadmap.phases,
    launchChecklist: roadmap.launchChecklist,
    criticalSuccessFactors: roadmap.criticalSuccessFactors,
    recommendedBuildOrder: roadmap.recommendedBuildOrder,
    planComparison: roadmap.planComparison,
  };
}

export function roadmapExportToPrintHtml(data: RoadmapExportData): string {
  const phasesHtml = data.phases
    .map(
      (phase, i) => `
      <section class="phase">
        <h3>Phase ${i + 1}: ${escapeHtml(phase.title)} (${phase.durationWeeks} weeks)</h3>
        <p>${escapeHtml(phase.description)}</p>
        <h4>Milestones</h4>
        <ul>${phase.milestones.map((m) => `<li><strong>${escapeHtml(m.title)}</strong> — ${escapeHtml(m.description)}</li>`).join("")}</ul>
        <h4>Tasks</h4>
        <ul>${phase.tasks.map((t) => `<li>[${t.priority}] ${escapeHtml(t.title)} (${t.estimatedHours}h)</li>`).join("")}</ul>
      </section>`
    )
    .join("");

  const buildOrderHtml = data.recommendedBuildOrder
    .map(
      (item, i) =>
        `<li><strong>${i + 1}. ${escapeHtml(item.title)}</strong> — ${escapeHtml(item.rationale)}</li>`
    )
    .join("");

  const checklistHtml = data.launchChecklist
    .map((item) => `<li><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.description)}</li>`)
    .join("");

  const factorsHtml = data.criticalSuccessFactors
    .map((f) => `<li><strong>${escapeHtml(f.title)}</strong> — ${escapeHtml(f.description)}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(data.title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; color: #111; line-height: 1.6; }
    h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
    h2 { font-size: 1.15rem; margin-top: 2rem; border-bottom: 1px solid #ddd; padding-bottom: 0.5rem; }
    h3 { font-size: 1rem; margin-top: 1.5rem; }
    h4 { font-size: 0.875rem; margin-top: 1rem; color: #555; }
    .meta { color: #666; font-size: 0.875rem; margin-bottom: 2rem; }
    .phase { margin-bottom: 1.5rem; page-break-inside: avoid; }
    ul { padding-left: 1.25rem; }
    li { margin-bottom: 0.35rem; }
    @media print { body { margin: 1cm; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(data.title)}</h1>
  <p class="meta">Generated ${new Date(data.generatedAt).toLocaleDateString()} · ${data.estimatedDurationMonths} months estimated</p>

  <h2>Execution Phases</h2>
  ${phasesHtml}

  <h2>Recommended Build Order</h2>
  <ol>${buildOrderHtml}</ol>

  <h2>Critical Success Factors</h2>
  <ul>${factorsHtml}</ul>

  <h2>Launch Checklist</h2>
  <ul>${checklistHtml}</ul>

  <h2>Plan Comparison</h2>
  <p><strong>Current:</strong> ${escapeHtml(data.planComparison.currentPlanSummary)}</p>
  <p><strong>Optimized:</strong> ${escapeHtml(data.planComparison.optimizedPlanSummary)}</p>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
