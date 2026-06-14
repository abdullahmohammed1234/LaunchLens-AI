import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { StoredExecutiveReport } from "@/types/executive-report";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1a1a1a",
    backgroundColor: "#ffffff",
  },
  coverPage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    color: "#ffffff",
    padding: 48,
  },
  coverTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#94a3b8",
    marginBottom: 32,
    textAlign: "center",
  },
  coverBrand: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 48,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
    color: "#0f172a",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    paddingBottom: 4,
  },
  paragraph: {
    fontSize: 10,
    lineHeight: 1.6,
    marginBottom: 8,
    color: "#334155",
  },
  listItem: {
    fontSize: 10,
    lineHeight: 1.5,
    marginBottom: 4,
    color: "#334155",
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f8fafc",
  },
  scoreLabel: {
    fontSize: 10,
    color: "#64748b",
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0f172a",
  },
  riskBox: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  riskTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#94a3b8",
  },
});

interface ExecutiveReportPdfDocumentProps {
  report: StoredExecutiveReport;
  projectTitle: string;
}

export function ExecutiveReportPdfDocument({
  report,
  projectTitle,
}: ExecutiveReportPdfDocumentProps) {
  const date = new Date(report.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const sortedSteps = [...report.recommendedNextSteps].sort(
    (a, b) => a.order - b.order
  );

  return (
    <Document>
      <Page size="A4" style={styles.coverPage}>
        <Text style={styles.coverTitle}>Executive Intelligence Report</Text>
        <Text style={styles.coverSubtitle}>{projectTitle}</Text>
        <Text style={{ fontSize: 12, color: "#cbd5e1" }}>
          Investment Readiness: {report.investmentReadinessScore}/100
        </Text>
        <Text style={styles.coverBrand}>
          LaunchLens AI · {date}
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <Text style={styles.paragraph}>{report.executiveSummary}</Text>

        <Text style={styles.sectionTitle}>Overall Assessment</Text>
        <Text style={styles.paragraph}>{report.overallAssessment}</Text>

        <Text style={styles.sectionTitle}>Readiness Scores</Text>
        <View style={styles.scoreRow}>
          <View>
            <Text style={styles.scoreLabel}>Investment</Text>
            <Text style={styles.scoreValue}>{report.investmentReadinessScore}</Text>
          </View>
          <View>
            <Text style={styles.scoreLabel}>Project</Text>
            <Text style={styles.scoreValue}>{report.projectReadinessScore}</Text>
          </View>
          <View>
            <Text style={styles.scoreLabel}>Execution</Text>
            <Text style={styles.scoreValue}>{report.executionReadinessScore}</Text>
          </View>
          <View>
            <Text style={styles.scoreLabel}>Team</Text>
            <Text style={styles.scoreValue}>{report.teamReadinessScore}</Text>
          </View>
          <View>
            <Text style={styles.scoreLabel}>Launch</Text>
            <Text style={styles.scoreValue}>{report.launchReadinessScore}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Strengths</Text>
        {report.strengths.map((s, i) => (
          <Text key={i} style={styles.listItem}>• {s}</Text>
        ))}

        <Text style={styles.sectionTitle}>Weaknesses</Text>
        {report.weaknesses.map((w, i) => (
          <Text key={i} style={styles.listItem}>• {w}</Text>
        ))}

        <View style={styles.footer}>
          <Text>LaunchLens AI Executive Report</Text>
          <Text>Page 2</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Critical Risks</Text>
        {report.criticalRisks.map((risk, i) => (
          <View key={i} style={styles.riskBox}>
            <Text style={styles.riskTitle}>
              {risk.title} ({risk.severity})
            </Text>
            <Text style={styles.listItem}>Impact: {risk.impact}</Text>
            <Text style={styles.listItem}>Likelihood: {risk.likelihood}</Text>
            <Text style={styles.listItem}>Mitigation: {risk.mitigation}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Success Factors</Text>
        {report.successFactors.map((f, i) => (
          <Text key={i} style={styles.listItem}>• {f}</Text>
        ))}

        <View style={styles.footer}>
          <Text>LaunchLens AI Executive Report</Text>
          <Text>Page 3</Text>
        </View>
      </Page>

      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Recommended Next Steps</Text>
        {sortedSteps.map((step) => (
          <Text key={step.order} style={styles.listItem}>
            {step.order}. [{step.priority}] {step.title} — {step.impact}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Final Recommendation</Text>
        <Text style={styles.paragraph}>{report.finalRecommendation}</Text>

        <View style={styles.footer}>
          <Text>LaunchLens AI Executive Report</Text>
          <Text>Page 4</Text>
        </View>
      </Page>
    </Document>
  );
}
