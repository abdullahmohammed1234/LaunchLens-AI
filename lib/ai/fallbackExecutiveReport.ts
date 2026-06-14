import type { ExecutiveReportData } from "@/types/executive-report";

export function createFallbackExecutiveReport(): ExecutiveReportData {
  return {
    executiveSummary:
      "This project shows moderate viability with identifiable strengths in problem clarity and execution potential, but faces meaningful risks in resource constraints and skill gaps that must be addressed before seeking investment. The intelligence gathered across analysis, simulation, and planning phases suggests a phased approach with validation milestones before scaling.",
    overallAssessment:
      "The venture sits in the 'cautiously optimistic' category. Core assumptions require validation, and the current team configuration may not support the stated timeline without adjustments. Investment readiness is limited until key blockers are resolved and a credible execution track record is established.",
    strengths: [
      "Clear problem articulation with identifiable target market",
      "Manageable MVP scope that can be delivered within stated budget",
      "Founder experience level supports iterative development approach",
      "Failure simulation reveals preventable risks with known mitigations",
      "Roadmap provides structured path from validation to launch",
    ],
    weaknesses: [
      "Skill gaps in critical technical or domain areas",
      "Timeline assumptions may be optimistic given complexity",
      "Limited evidence of market validation or early traction",
      "Team size may be insufficient for parallel workstreams",
      "Budget constraints could delay key hiring or infrastructure needs",
    ],
    criticalRisks: [
      {
        title: "Scope creep beyond MVP",
        severity: "high",
        impact: "Delays launch by 2-4 months and increases burn rate",
        likelihood: "high",
        mitigation:
          "Lock MVP scope document and require formal change requests for additions",
        source: "analysis",
      },
      {
        title: "Technical complexity underestimated",
        severity: "medium",
        impact: "Core features may require architecture rework mid-development",
        likelihood: "medium",
        mitigation:
          "Conduct technical spike on highest-risk components before full build",
        source: "analysis",
      },
      {
        title: "Market timing and competition",
        severity: "medium",
        impact: "Reduced differentiation window and harder customer acquisition",
        likelihood: "medium",
        mitigation:
          "Accelerate validation phase and establish early user relationships",
        source: "simulation",
      },
      {
        title: "Key skill gaps unaddressed",
        severity: "high",
        impact: "Quality issues and delayed delivery on critical path items",
        likelihood: "high",
        mitigation:
          "Prioritize hiring or contracting for critical roles in first 30 days",
        source: "team",
      },
      {
        title: "Execution timeline slippage",
        severity: "medium",
        impact: "Missed launch window and increased operational costs",
        likelihood: "medium",
        mitigation:
          "Implement weekly milestone reviews with buffer built into roadmap phases",
        source: "roadmap",
      },
    ],
    successFactors: [
      "Rigorous MVP scoping and scope discipline",
      "Early and continuous user validation",
      "Phased hiring aligned with roadmap milestones",
      "Proactive risk monitoring from simulation insights",
    ],
    investmentReadinessScore: 42,
    projectReadinessScore: 55,
    executionReadinessScore: 48,
    teamReadinessScore: 40,
    launchReadinessScore: 38,
    recommendedNextSteps: [
      {
        title: "Complete 10+ user discovery interviews",
        priority: "critical",
        impact: "Validates problem-solution fit and refines MVP scope",
        order: 1,
      },
      {
        title: "Document and freeze MVP feature list",
        priority: "critical",
        impact: "Prevents scope creep and protects timeline",
        order: 2,
      },
      {
        title: "Address top skill gap via hire or contractor",
        priority: "high",
        impact: "Unblocks critical path technical work",
        order: 3,
      },
      {
        title: "Run technical spike on highest-risk component",
        priority: "high",
        impact: "Surfaces architecture issues before full investment",
        order: 4,
      },
      {
        title: "Establish weekly milestone review cadence",
        priority: "medium",
        impact: "Early detection of timeline slippage",
        order: 5,
      },
      {
        title: "Create investor one-pager with validated metrics",
        priority: "medium",
        impact: "Prepares for future fundraising conversations",
        order: 6,
      },
    ],
    finalRecommendation:
      "Proceed with a validation-first approach. Do not pursue significant investment until MVP scope is locked, top skill gaps are addressed, and initial user validation data is available. The project has foundation potential but requires 2-3 months of disciplined execution before investment readiness improves materially.",
  };
}
