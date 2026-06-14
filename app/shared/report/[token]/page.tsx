import { SharedReportView } from "@/components/reports/shared-report-view";

interface SharedReportPageProps {
  params: Promise<{ token: string }>;
}

export default async function SharedReportPage({
  params,
}: SharedReportPageProps) {
  const { token } = await params;

  return <SharedReportView token={token} />;
}
