import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { STALE_TIME } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

/** One day of NoteBot MCP activity (Asia/Dhaka dates). */
export type McpDay = {
  date: string;
  emails: number;
  keys: number;
  requests: number;
};

/**
 * GET /mcp/summary (admin only): the MCP server's own bookkeeping.
 * `requests.total` is the all-time counter on the keys; today/last7d/last30d
 * come from the daily "ai" platform rows, so they read 0 until the MCP server
 * reports usage (ANALYTICS_ADMIN_KEY set on it).
 */
export type McpSummaryResponse = {
  status: string;
  emails: { total: number; new7d: number; new30d: number; unsubscribed: number };
  keys: {
    total: number;
    active: number;
    revoked: number;
    used: number;
    active7d: number;
    active24h: number;
    new7d: number;
    new30d: number;
  };
  requests: {
    total: number;
    today: number;
    last7d: number;
    last30d: number;
    reported: number;
  };
  daily: McpDay[];
  sources: { source: string; keys: number }[];
  topKeys: { email: string; source: string; requests: number; lastUsed: string }[];
};

export const useGetMcpSummary = (days = 30) => {
  return useQuery<McpSummaryResponse | null, Error>({
    queryKey: queryKeys.mcpSummary(days),
    queryFn: () =>
      getJson<McpSummaryResponse>(API_CONFIG.MCP_SUMMARY, { params: { days } }),
    staleTime: STALE_TIME.live,
  });
};
