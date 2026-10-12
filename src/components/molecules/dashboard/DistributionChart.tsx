import { Box } from "@/components/atoms/layout";
import { EvilPieChart } from "@/components/evilcharts/charts/recharts-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PLATFORM_CHART_CONFIG } from "./chart-theme";

/**
 * A sector of the distribution donut. `platform` must be one of the keys in
 * PLATFORM_CHART_CONFIG ("app" / "bot" / "ai") — Evil Charts looks the sector's
 * gradient and label up by that name.
 */
export type DistributionSlice = {
  platform: string;
  share: number;
};

interface DistributionChartProps {
  pieChartData: DistributionSlice[];
  isLoading?: boolean;
}

export function DistributionChart({
  pieChartData,
  isLoading = false,
}: DistributionChartProps) {
  const leader = pieChartData.reduce<DistributionSlice | null>(
    (top, slice) => (!top || slice.share > top.share ? slice : top),
    null
  );

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-col gap-0.5">
          <span className="text-base font-semibold">Platform Distribution</span>
          <span className="text-xs font-normal text-muted-foreground">
            {leader && !isLoading
              ? `${
                  PLATFORM_CHART_CONFIG[
                    leader.platform as keyof typeof PLATFORM_CHART_CONFIG
                  ]?.label ?? leader.platform
                } leads with ${leader.share.toFixed(2)}% of all interactions`
              : "Share of total interactions"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || pieChartData.length > 0 ? (
          <EvilPieChart
            config={PLATFORM_CHART_CONFIG}
            data={pieChartData}
            dataKey="share"
            nameKey="platform"
            isLoading={isLoading}
            className="aspect-auto h-[300px] md:h-[400px]"
          >
            <EvilPieChart.Pie
              variant="gradient"
              innerRadius="55%"
              outerRadius="82%"
              cornerRadius={8}
              paddingAngle={3}
              glowingSectors={pieChartData.map(slice => slice.platform)}
              // AI is a fraction of a percent next to App; give every sector a
              // visible sliver while the label and tooltip keep the true share.
              pieProps={{ minAngle: 6 }}
            >
              <EvilPieChart.Label
                labelListProps={{
                  className: "fill-background text-xs font-semibold",
                  formatter: value => {
                    const share = Number(value);
                    return share < 1 ? `${share.toFixed(2)}%` : `${share.toFixed(1)}%`;
                  },
                }}
              />
            </EvilPieChart.Pie>
            <EvilPieChart.Tooltip variant="frosted-glass" roundness="lg" />
            <EvilPieChart.Legend variant="rounded-square" align="center" />
          </EvilPieChart>
        ) : (
          <Box className="h-[300px] md:h-[400px] w-full flex items-center justify-center text-muted-foreground">
            No distribution data available
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
