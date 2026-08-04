import { API_CONFIG } from "@/constants/api-config";
import { apiClient } from "@/lib/api-client";
import { STALE_TIME } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface AnalyticsStatus {
  db_connection: boolean;
  endPoints: string[];
  mode: string;
}

interface NotebotStatus {
  isServerRunning: boolean;
  url: string;
  paths: string[];
  botStatus: boolean;
  msg: string;
}

interface CombinedStatus {
  analytics: AnalyticsStatus | null;
  notebot: NotebotStatus | null;
}

/**
 * Probes both platforms in parallel. `allSettled` keeps one platform being down
 * from hiding the other's status — a rejected probe simply reports `null`, which
 * the dashboard renders as "🔴 Down" instead of erroring the whole card.
 */
const fetchBothStatuses = async (): Promise<CombinedStatus> => {
  const [analytics, notebot] = await Promise.allSettled([
    apiClient.get<AnalyticsStatus>(API_CONFIG.PLATFORM_STATUS),
    apiClient.get<NotebotStatus>(API_CONFIG.BOT_STATUS),
  ]);

  return {
    analytics: analytics.status === "fulfilled" ? analytics.value.data : null,
    notebot: notebot.status === "fulfilled" ? notebot.value.data : null,
  };
};

export const useGetPlatformStatus = () => {
  return useQuery<CombinedStatus, Error>({
    queryKey: queryKeys.status,
    queryFn: () => fetchBothStatuses(),
    staleTime: STALE_TIME.status,
    // The probe resolves even when a platform is down, so a retry would only
    // ever repeat a genuine transport failure.
    retry: (failureCount, error) =>
      !(error instanceof AxiosError) && failureCount < 1,
  });
};
