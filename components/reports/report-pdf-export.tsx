"use client";

import { useState } from "react";
import { Download, FileDown } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { StoredExecutiveReport } from "@/types/executive-report";
import { ExecutiveReportPdfDocument } from "@/components/reports/executive-report-pdf";
import { Button } from "@/components/ui/button";

interface ReportPdfExportProps {
  report: StoredExecutiveReport;
  projectTitle: string;
}

export function ReportPdfExport({ report, projectTitle }: ReportPdfExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport() {
    setIsExporting(true);
    try {
      const blob = await pdf(
        <ExecutiveReportPdfDocument report={report} projectTitle={projectTitle} />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectTitle.replace(/[^a-z0-9]/gi, "_")}_Executive_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("PDF report downloaded");
    } catch (error) {
      console.error("[ReportPdfExport]", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={isExporting}
      >
        {isExporting ? (
          <FileDown className="h-4 w-4 mr-2 animate-pulse" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        {isExporting ? "Generating..." : "Export PDF"}
      </Button>
    </motion.div>
  );
}
