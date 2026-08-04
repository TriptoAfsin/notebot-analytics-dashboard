import { Box } from "@/components/atoms/layout";
import { EvilPieChart } from "@/components/evilcharts/charts/recharts-pie-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCcw } from "lucide-react";
import {
  formatCompactNumber,
  formatFullNumber,
  PLATFORM_CHART_CONFIG,
} from "./chart-theme";

/** A single platform's interaction count for the selected day. */
export type DayBreakdown = {
  platform: string;
  count: number;
};

interface TodayChartProps {
  selectedDayData: DayBreakdown[];
  selectedDay: string;
  setSelectedDay: (value: string) => void;
  refetchDailyReport: () => void;
  isRefetching?: boolean;
}

export function TodayChart({
  selectedDayData,
  selectedDay,
  setSelectedDay,
  refetchDailyReport,
  isRefetching = false,
}: TodayChartProps) {
  const total = selectedDayData.reduce((sum, entry) => sum + entry.count, 0);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2">
          <Box className="flex flex-col gap-0.5">
            <span className="text-base font-semibold">
              {formatFullNumber(total)}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              interactions {selectedDay}
            </span>
          </Box>

          <Box className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refetchDailyReport}
              aria-label="Refresh daily breakdown"
              className="gap-2"
            >
              <RefreshCcw
                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
              />
            </Button>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
              </SelectContent>
            </Select>
          </Box>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedDayData.length > 0 ? (
          <EvilPieChart
            config={PLATFORM_CHART_CONFIG}
            data={selectedDayData}
            dataKey="count"
            nameKey="platform"
            className="aspect-auto h-[300px] md:h-[400px]"
          >
            <EvilPieChart.Pie
              variant="gradient"
              innerRadius="52%"
              outerRadius="80%"
              cornerRadius={8}
              paddingAngle={3}
              glowingSectors={selectedDayData.map(entry => entry.platform)}
            >
              <EvilPieChart.Label
                labelListProps={{
                  className: "fill-background text-xs font-semibold",
                  formatter: value => formatCompactNumber(Number(value)),
                }}
              />
            </EvilPieChart.Pie>
            <EvilPieChart.Tooltip variant="frosted-glass" roundness="lg" />
            <EvilPieChart.Legend variant="rounded-square" align="center" />
          </EvilPieChart>
        ) : (
          <Box className="h-[300px] md:h-[400px] w-full flex items-center justify-center text-muted-foreground">
            No data available for {selectedDay}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
