import type { AnalyzeProjectInput } from "@/lib/validations/analysis";

export interface SampleProject {
  id: string;
  label: string;
  description: string;
  data: AnalyzeProjectInput;
}

export const SAMPLE_PROJECTS: SampleProject[] = [
  {
    id: "launchlens-ai",
    label: "LaunchLens AI",
    description: "AI project intelligence platform",
    data: {
      title: "LaunchLens AI",
      description:
        "A SaaS platform that helps founders validate startup ideas with AI-powered analysis, failure simulation, roadmaps, and investor-ready reports.",
      budget: "$35,000",
      timeline: "6 months",
      teamSize: 3,
      experienceLevel: "intermediate",
    },
  },
  {
    id: "studysync",
    label: "StudySync",
    description: "Collaborative study platform",
    data: {
      title: "StudySync",
      description:
        "Mobile-first study companion with synced notes, AI quiz generation, spaced repetition, and group study rooms for university students.",
      budget: "$20,000",
      timeline: "5 months",
      teamSize: 2,
      experienceLevel: "beginner",
    },
  },
  {
    id: "fittrack",
    label: "FitTrack",
    description: "AI workout companion",
    data: {
      title: "FitTrack",
      description:
        "Mobile fitness app with personalized workout plans, form correction via camera, progress tracking, and social accountability features.",
      budget: "$15,000",
      timeline: "4 months",
      teamSize: 2,
      experienceLevel: "beginner",
    },
  },
  {
    id: "ecoroute",
    label: "EcoRoute",
    description: "Sustainable logistics optimization",
    data: {
      title: "EcoRoute",
      description:
        "B2B platform helping delivery companies optimize routes for carbon reduction and fuel savings with ESG compliance reporting.",
      budget: "$60,000",
      timeline: "10 months",
      teamSize: 5,
      experienceLevel: "advanced",
    },
  },
];
