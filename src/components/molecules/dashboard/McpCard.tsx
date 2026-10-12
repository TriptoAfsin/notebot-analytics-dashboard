import { Box } from "@/components/atoms/layout";
import type { ChartConfig } from "@/components/evilcharts/ui/recharts-chart";
import { EvilBarChart } from "@/components/evilcharts/charts/recharts-bar-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMcpSummary } from "@/hooks/networking/analytics/mcp-summary";
import dayjs from "dayjs";
import { Activity, ExternalLink, KeyRound, Mail, RefreshCcw, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { formatCompactNumber, formatFullNumber } from "./chart-theme";

/** Keys must match the series fields on McpDay. */
const MCP_CHART_CONFIG = {
  emails: {
    label: "New emails",
    colors: {
      light: ["#60a5fa", "#1d4ed8"],
      dark: ["#93c5fd", "#2563eb"],
    },
  },
  keys: {
    label: "New keys",
    colors: {
      light: ["#34d399", "#047857"],
      dark: ["#6ee7b7", "#059669"],
    },
  },
  requests: {
    label: "Requests",
    colors: {
      light: ["#fbbf24", "#b45309"],
      dark: ["#fcd34d", "#d97706"],
    },
  },
} satisfies ChartConfig;

const SOURCE_LABEL: Record<string, string> = {
  oauth: "App sign-in (OAuth)",
  dashboard: "Website form",
};

function Stat({
  icon,
  label,
  value,
  hint,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <Box className="p-4 border rounded-lg">
      <Box className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </Box>
      <Box className="mt-1 text-2xl font-semibold tabular-nums">
        {formatFullNumber(value)}
      </Box>
      <Box className="mt-1 text-xs text-muted-foreground">{hint}</Box>
    </Box>
  );
}

/**
 * NoteBot MCP (ai.butexnotebot.com): how many people registered an email, how
 * many keys are out, and how much traffic the AI apps send.
 */
export function McpCard() {
  const { data, isLoading, error, refetch, isRefetching } = useGetMcpSummary(30);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[220px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="h-[104px]" />
            ))}
          </Box>
          <Skeleton className="h-[260px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">NoteBot MCP</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Couldn't load MCP stats. The analytics API needs the /mcp/summary
          endpoint and DB_DRIVER=postgres.
        </CardContent>
      </Card>
    );
  }

  const { emails, keys, requests, daily, sources, topKeys } = data;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between gap-2">
          <Box className="flex flex-col gap-0.5">
            <span className="flex items-center gap-2 text-base font-semibold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              NoteBot MCP
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              Emails, keys and requests from AI apps, last 30 days
            </span>
          </Box>
          <Box className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              aria-label="Refresh MCP stats"
            >
              <RefreshCcw
                className={`w-4 h-4 ${isRefetching ? "animate-spin" : ""}`}
              />
            </Button>
            <Button asChild variant="default" size="sm">
              <a
                href="https://ai.butexnotebot.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open ai.butexnotebot.com"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </Box>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Box className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={<Mail className="w-4 h-4 text-blue-500" />}
            label="Emails registered"
            value={emails.total}
            hint={`+${formatFullNumber(emails.new7d)} this week · ${formatFullNumber(emails.unsubscribed)} unsubscribed`}
          />
          <Stat
            icon={<KeyRound className="w-4 h-4 text-green-500" />}
            label="Keys issued"
            value={keys.total}
            hint={`${formatFullNumber(keys.active)} active · ${formatFullNumber(keys.revoked)} replaced · ${formatFullNumber(keys.used)} used`}
          />
          <Stat
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
            label="Requests served"
            value={requests.total}
            hint={`${formatFullNumber(requests.today)} today · ${formatFullNumber(requests.last7d)} last 7 days`}
          />
          <Stat
            icon={<Activity className="w-4 h-4 text-violet-500" />}
            label="Keys active this week"
            value={keys.active7d}
            hint={`${formatFullNumber(keys.active24h)} in the last 24 hours`}
          />
        </Box>

        <EvilBarChart
          config={MCP_CHART_CONFIG}
          data={daily}
          xDataKey="date"
          barRadius={4}
          barGap={2}
          barCategoryGap={6}
          animationType="left-to-right"
          className="aspect-auto h-[260px]"
          chartProps={{ margin: { top: 12, right: 8, left: 0, bottom: 0 } }}
        >
          <EvilBarChart.Grid />
          <EvilBarChart.XAxis
            dataKey="date"
            tick={{ fontSize: 11 }}
            tickFormatter={(date: string) => dayjs(date).format("D MMM")}
          />
          <EvilBarChart.YAxis
            allowDecimals={false}
            tick={{ fontSize: 11 }}
            tickFormatter={formatCompactNumber}
          />
          {/* requests run far above signups, so they get their own axis */}
          <EvilBarChart.YAxis
            yAxisId="requests"
            orientation="right"
            allowDecimals={false}
            tick={{ fontSize: 11 }}
            tickFormatter={formatCompactNumber}
          />
          <EvilBarChart.Tooltip variant="frosted-glass" roundness="lg" />
          <EvilBarChart.Legend variant="rounded-square" align="right" />
          <EvilBarChart.Bar dataKey="emails" variant="gradient" />
          <EvilBarChart.Bar dataKey="keys" variant="gradient" />
          <EvilBarChart.Bar
            dataKey="requests"
            variant="gradient"
            barProps={{ yAxisId: "requests" }}
          />
        </EvilBarChart>

        <Box className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <Box className="min-w-0">
            <h3 className="mb-2 text-sm font-semibold">Busiest keys</h3>
            {topKeys.length === 0 ? (
              <p className="text-sm text-muted-foreground">No requests yet.</p>
            ) : (
              <Box className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead className="hidden sm:table-cell">Signed up via</TableHead>
                      <TableHead className="text-right">Requests</TableHead>
                      <TableHead className="text-right">Last used</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topKeys.map((k, i) => (
                      <TableRow key={`${k.email}-${i}`}>
                        <TableCell className="font-mono text-xs">{k.email}</TableCell>
                        <TableCell className="hidden text-xs sm:table-cell">
                          {SOURCE_LABEL[k.source] ?? k.source}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatFullNumber(k.requests)}
                        </TableCell>
                        <TableCell className="text-xs text-right whitespace-nowrap text-muted-foreground">
                          {k.lastUsed || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Box>

          <Box>
            <h3 className="mb-2 text-sm font-semibold">Where keys come from</h3>
            <Box className="space-y-2">
              {sources.map(s => (
                <Box
                  key={s.source}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-muted-foreground">
                    {SOURCE_LABEL[s.source] ?? s.source}
                  </span>
                  <span className="font-semibold tabular-nums">
                    {formatFullNumber(s.keys)}
                  </span>
                </Box>
              ))}
            </Box>
            <p className="mt-4 text-xs text-muted-foreground">
              Requests served counts every call on every key since launch. The
              daily bars and today / 7-day figures come from the &quot;ai&quot;
              platform reports.
            </p>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
