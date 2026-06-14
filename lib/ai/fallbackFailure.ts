import type { FailureSimulation } from "@/types/failure-simulation";

export function createFallbackFailureSimulation(): FailureSimulation {
  return {
    scenarios: [
      {
        title: "Scope Creep Collapse",
        summary:
          "Incremental feature additions without prioritization erode focus until the MVP never ships.",
        probability: 62,
        severity: "high",
        timeline: [
          {
            month: 1,
            event: "Development begins with an ambitious feature list",
            impact: "Team spreads effort across too many workstreams",
          },
          {
            month: 2,
            event: "Stakeholders request additional capabilities",
            impact: "Original MVP boundaries blur without a change-control process",
          },
          {
            month: 3,
            event: "Core features remain incomplete while polish work starts",
            impact: "Integration issues surface late with no stable foundation",
          },
          {
            month: 4,
            event: "Launch date slips as scope continues expanding",
            impact: "Morale drops and external commitments are missed",
          },
          {
            month: 5,
            event: "Budget consumed without a shippable product",
            impact: "Funding pressure forces cuts to essential infrastructure",
          },
          {
            month: 6,
            event: "Project abandoned or pivoted without validation",
            impact: "Months of work discarded with no user feedback captured",
          },
        ],
        rootCauses: [
          {
            title: "Unclear MVP Boundaries",
            description:
              "The team never locked a minimal feature set, so every request felt in-scope.",
            severity: "high",
          },
          {
            title: "No Scope Change Process",
            description:
              "New requirements were added without assessing timeline or trade-off impact.",
            severity: "medium",
          },
          {
            title: "Perfectionism Before Validation",
            description:
              "Polish and edge cases were prioritized before proving core value.",
            severity: "medium",
          },
        ],
        preventionStrategies: [
          "Freeze MVP scope in writing and require a written trade-off for any addition",
          "Ship a functional prototype to 5 users before adding secondary features",
          "Run weekly scope reviews with explicit cut-list decisions",
          "Assign one owner accountable for saying no to scope expansion",
        ],
      },
      {
        title: "Technical Debt Spiral",
        summary:
          "Shortcuts taken early compound into unmaintainable code, slowing every subsequent release.",
        probability: 48,
        severity: "medium",
        timeline: [
          {
            month: 1,
            event: "Rapid prototyping with minimal architecture planning",
            impact: "Quick wins mask structural weaknesses",
          },
          {
            month: 2,
            event: "Features built on fragile foundations",
            impact: "Bug fix time exceeds new feature development",
          },
          {
            month: 3,
            event: "Refactoring deferred due to deadline pressure",
            impact: "Each new feature takes longer than the last",
          },
          {
            month: 4,
            event: "Critical bugs in production affect early users",
            impact: "Team enters reactive firefighting mode",
          },
          {
            month: 5,
            event: "Rewrite considered but deemed too costly mid-stream",
            impact: "Velocity drops to near zero",
          },
        ],
        rootCauses: [
          {
            title: "Insufficient Technical Experience",
            description:
              "Architecture decisions were made without anticipating scale or maintainability needs.",
            severity: "high",
          },
          {
            title: "No Testing Infrastructure",
            description:
              "Manual testing became the bottleneck as complexity grew.",
            severity: "medium",
          },
          {
            title: "Deadline-Driven Shortcuts",
            description:
              "Speed was prioritized over code quality with no planned payback period.",
            severity: "medium",
          },
        ],
        preventionStrategies: [
          "Allocate 20% of each sprint to debt reduction from month one",
          "Establish automated testing for critical user paths before scaling features",
          "Conduct a monthly architecture review with an experienced advisor",
          "Document technical decisions and their expected lifespan",
        ],
      },
      {
        title: "Burnout & Abandonment",
        summary:
          "Sustained overwork without milestones or support leads to team attrition and project stall.",
        probability: 35,
        severity: "high",
        timeline: [
          {
            month: 1,
            event: "High-intensity push with optimistic timeline",
            impact: "Team commits evenings and weekends to stay on track",
          },
          {
            month: 2,
            event: "First major setback without recovery time",
            impact: "Stress accumulates without visible progress markers",
          },
          {
            month: 3,
            event: "Key contributor reduces availability",
            impact: "Remaining members absorb extra load",
          },
          {
            month: 4,
            event: "Communication breaks down under pressure",
            impact: "Decisions stall and duplicate work increases",
          },
          {
            month: 5,
            event: "Motivation collapses after missed external deadline",
            impact: "Active development slows to sporadic bursts",
          },
          {
            month: 6,
            event: "Project quietly shelved",
            impact: "No formal post-mortem; lessons are lost",
          },
        ],
        rootCauses: [
          {
            title: "Unrealistic Timeline Expectations",
            description:
              "The stated deadline ignored team capacity and learning curves.",
            severity: "high",
          },
          {
            title: "No Milestone Celebrations",
            description:
              "Months of work passed without acknowledging progress, eroding motivation.",
            severity: "medium",
          },
          {
            title: "Single Points of Failure",
            description:
              "Critical knowledge lived with one person with no backup or documentation.",
            severity: "high",
          },
        ],
        preventionStrategies: [
          "Set bi-weekly milestones with visible deliverables and team recognition",
          "Cap weekly hours and track burnout signals in standups",
          "Cross-train team members on critical systems within the first month",
          "Build a 25% timeline buffer for unknowns into the project plan",
        ],
      },
    ],
  };
}
