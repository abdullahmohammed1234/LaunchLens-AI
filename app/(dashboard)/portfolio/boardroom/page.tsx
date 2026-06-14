import { auth } from "@/auth";
import {
  analyzePortfolio,
  getPortfolioProjects,
} from "@/lib/portfolio/analyzePortfolio";
import { PageContainer } from "@/components/layout/page-container";
import { ExecutivePortfolioView } from "@/components/portfolio/executive-portfolio-view";

export default async function PortfolioBoardroomPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [projects, analytics] = await Promise.all([
    getPortfolioProjects(userId),
    analyzePortfolio(userId),
  ]);

  return (
    <PageContainer>
      <ExecutivePortfolioView analytics={analytics} projects={projects} />
    </PageContainer>
  );
}
