import { Box } from "@/components/atoms/layout";
import { EvilBarChart } from "@/components/evilcharts/charts/recharts-bar-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import dayjs from "dayjs";
import { ExternalLink, RefreshCcw } from "lucide-react";
import { formatCompactNumber, PLATFORM_CHART_CONFIG } from "./chart-theme";

/** One row per day, with each platform's interactions as its own series. */
export type TimelinePoint = {
  date: string;
  app: number;
  bot: number;
  ai: number;
};

interface TimelineChartProps {
  filteredChartData: TimelinePoint[];
  timeRange: string;
  setTimeRange: (value: string) => void;
  refetchDailyReport: () => void;
  isRefetching?: boolean;
}

/** Value label drawn above each bar, tinted to match its series. */
const valueLabel = (colorVar: string) =>
  ({
    position: "top",
    fontSize: 10,
    fill: colorVar,
    formatter: (value: string | number | boolean | null | undefined) =>
      formatCompactNumber(Number(value ?? 0)),
  }) as const;

const appValueLabel = valueLabel("var(--chart-label-app)");
const botValueLabel = valueLabel("var(--chart-label-bot)");
const aiValueLabel = valueLabel("var(--chart-label-ai)");

export function TimelineChart({
  filteredChartData,
  timeRange,
  setTimeRange,
  refetchDailyReport,
  isRefetching = false,
}: TimelineChartProps) {
  // 14 labels across a week reads fine; 60 across a month is a smear, so the
  // month view leans on the tooltip instead.
  const showValueLabels = timeRange === "7days";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2">
          <Box className="flex flex-col gap-0.5">
            <span className="text-base font-semibold">Interactions</span>
            <span className="text-xs font-normal text-muted-foreground">
              App (left axis) vs Bot & AI (right axis), daily
            </span>
          </Box>

          <Box className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refetchDailyReport}
              aria-label="Refresh timeline"
              className="gap-2"
            >
              <RefreshCcw
                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
              />
            </Button>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button asChild variant="default" size="sm" className="gap-2">
              <a
                href="https://lookerstudio.google.com/u/0/reporting/c6301162-7c93-42b3-a630-a7404eab6b4e/page/3RR3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open full report in Looker Studio"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </Box>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EvilBarChart
          config={PLATFORM_CHART_CONFIG}
          data={filteredChartData}
          xDataKey="date"
          barRadius={6}
          barGap={2}
          barCategoryGap={timeRange === "7days" ? 24 : 8}
          animationType="left-to-right"
          className="aspect-auto h-[320px] md:h-[400px]"
          chartProps={{ margin: { top: 12, right: 8, left: 0, bottom: 0 } }}
        >
          <EvilBarChart.Grid />
          <EvilBarChart.XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(date: string) => dayjs(date).format("D MMM")}
          />
          {/* App keeps the default axis (id 0) so the grid and tooltip cursor
              still have an axis to anchor to. */}
          <EvilBarChart.YAxis
            tick={{ fontSize: 11, fill: "var(--chart-label-app)" }}
            tickFormatter={formatCompactNumber}
          />
          {/* Bot runs two orders of magnitude below App, so on a shared axis its
              bars collapse into a sliver. Its own right-hand axis makes the daily
              shape readable; the axis ticks and value labels are tinted to match
              each series so the two scales can't be confused. */}
          <EvilBarChart.YAxis
            yAxisId="bot"
            orientation="right"
            tick={{ fontSize: 11, fill: "var(--chart-label-bot)" }}
            tickFormatter={formatCompactNumber}
          />
          <EvilBarChart.Tooltip variant="frosted-glass" roundness="lg" />
          <EvilBarChart.Legend variant="rounded-square" align="right" />
          <EvilBarChart.Bar
            dataKey="app"
            variant="gradient"
            glowing
            barProps={{ label: showValueLabels ? appValueLabel : undefined }}
          />
          <EvilBarChart.Bar
            dataKey="bot"
            variant="gradient"
            glowing
            barProps={{
              yAxisId: "bot",
              label: showValueLabels ? botValueLabel : undefined,
            }}
          />
          {/* AI (MCP) traffic sits on the same small-scale axis as Bot. */}
          <EvilBarChart.Bar
            dataKey="ai"
            variant="gradient"
            glowing
            barProps={{
              yAxisId: "bot",
              label: showValueLabels ? aiValueLabel : undefined,
            }}
          />
        </EvilBarChart>
      </CardContent>
    </Card>
  );
}
