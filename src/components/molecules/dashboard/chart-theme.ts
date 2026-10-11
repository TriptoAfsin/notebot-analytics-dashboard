import type { ChartConfig } from "@/components/evilcharts/ui/recharts-chart";

/**
 * Shared series styling for every platform chart on the dashboard.
 *
 * Keys must match the platform values coming back from the analytics API
 * ("app" / "bot" / "ai") because Evil Charts resolves each series' gradient and legend
 * label from the config key. Each `colors` array is rendered as top-to-bottom
 * gradient stops, and the light/dark entries are emitted as scoped CSS
 * variables so the charts follow the app's theme toggle.
 */
export const PLATFORM_CHART_CONFIG = {
  app: {
    label: "App",
    colors: {
      light: ["#60a5fa", "#1d4ed8"],
      dark: ["#93c5fd", "#2563eb"],
    },
  },
  bot: {
    label: "Bot",
    colors: {
      light: ["#34d399", "#047857"],
      dark: ["#6ee7b7", "#059669"],
    },
  },
  // MCP servers (Claude, ChatGPT, …) reading NoteBot content
  ai: {
    label: "AI",
    colors: {
      light: ["#fbbf24", "#b45309"],
      dark: ["#fcd34d", "#d97706"],
    },
  },
} satisfies ChartConfig;

/** Compact axis/label formatting so large interaction counts stay readable. */
export const formatCompactNumber = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

/** Full-precision formatting for tooltips and totals. */
export const formatFullNumber = (value: number) => value.toLocaleString();
