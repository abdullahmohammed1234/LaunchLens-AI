type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: string;
}

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: string;
}

const MAX_LOGS = 50;
const logs: LogEntry[] = [];
const metrics: PerformanceMetric[] = [];

function pushLog(entry: LogEntry) {
  logs.unshift(entry);
  if (logs.length > MAX_LOGS) logs.pop();

  if (process.env.NODE_ENV === "development") {
    const fn =
      entry.level === "error"
        ? console.error
        : entry.level === "warn"
          ? console.warn
          : console.info;
    fn(`[LaunchLens] ${entry.message}`, entry.context ?? "");
  }
}

export const monitor = {
  log(message: string, context?: Record<string, unknown>) {
    pushLog({
      level: "info",
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  },

  warn(message: string, context?: Record<string, unknown>) {
    pushLog({
      level: "warn",
      message,
      context,
      timestamp: new Date().toISOString(),
    });
  },

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    pushLog({
      level: "error",
      message,
      context: {
        ...context,
        error: error instanceof Error ? error.message : String(error),
      },
      timestamp: new Date().toISOString(),
    });
  },

  trackPerformance(name: string, duration: number) {
    metrics.unshift({
      name,
      duration,
      timestamp: new Date().toISOString(),
    });
    if (metrics.length > MAX_LOGS) metrics.pop();
  },

  async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      return await fn();
    } finally {
      monitor.trackPerformance(name, performance.now() - start);
    }
  },

  getRecentLogs() {
    return [...logs];
  },

  getRecentMetrics() {
    return [...metrics];
  },

  trackEvent(event: string, properties?: Record<string, unknown>) {
    monitor.log(`event:${event}`, properties);
    if (typeof window !== "undefined" && "gtag" in window) {
      // Analytics hook — wire to GA/Plausible when configured
    }
  },
};

export function reportClientError(error: Error, errorInfo?: { componentStack?: string }) {
  monitor.error("Client error boundary", error, {
    componentStack: errorInfo?.componentStack,
  });
}
