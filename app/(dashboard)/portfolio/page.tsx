import { auth } from "@/auth";
import {
  analyzePortfolio,
  getPortfolioProjects,
} from "@/lib/portfolio/analyzePortfolio";
import { PortfolioOverviewContent } from "@/components/portfolio/portfolio-overview-content";

export default async function PortfolioPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [projects, analytics] = await Promise.all([
    getPortfolioProjects(userId),
    analyzePortfolio(userId),
  ]);

  return (
    <PortfolioOverviewContent projects={projects} analytics={analytics} />
  );
}
