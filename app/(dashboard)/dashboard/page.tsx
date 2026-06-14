import { auth } from "@/auth";
import { getFounderDashboardData } from "@/lib/portfolio/founderDashboard";
import { getPortfolioProjects } from "@/lib/portfolio/analyzePortfolio";
import { FounderDashboardContent } from "@/components/dashboard/founder-dashboard-content";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [data, projects] = await Promise.all([
    getFounderDashboardData(userId),
    getPortfolioProjects(userId),
  ]);

  const projectOptions = projects.map((p) => ({
    id: p.id,
    title: p.title,
  }));

  return (
    <FounderDashboardContent data={data} projectOptions={projectOptions} />
  );
}
