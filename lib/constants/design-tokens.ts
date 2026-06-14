export const DESIGN_TOKENS = {
  colors: {
    background: "#0A0A0A",
    surface: "#111111",
    card: "#18181B",
    border: "#27272A",
    primary: "#6366F1",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    foreground: "#FAFAFA",
    muted: "#A1A1AA",
  },
  spacing: {
    page: "p-4 md:p-6 lg:p-8",
    section: "space-y-6 md:space-y-8",
    card: "p-4 md:p-6",
    gap: "gap-4 md:gap-6",
  },
  radius: {
    sm: "rounded-lg",
    md: "rounded-xl",
    lg: "rounded-2xl",
    full: "rounded-full",
  },
  shadow: {
    card: "shadow-lg shadow-black/20",
    elevated: "shadow-xl shadow-primary/10",
    glow: "glow-primary",
  },
  typography: {
    pageTitle: "text-2xl md:text-3xl font-bold tracking-tight",
    sectionTitle: "text-lg md:text-xl font-semibold",
    body: "text-sm leading-relaxed",
    caption: "text-xs text-muted",
  },
  motion: {
    fadeIn: { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4 } },
    slideUp: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4 },
    },
  },
} as const;
