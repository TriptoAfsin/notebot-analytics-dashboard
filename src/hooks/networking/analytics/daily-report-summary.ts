import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { STALE_TIME } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

type DailySummaryResponse = {
  kpi: {
    appPlatformPercentage: number;
    botPlatformPercentage: number;
    highestApiCountDate: string;
    highestAppPlatformCount: number;
    highestBotPlatformCount: number;
    highestPlatform: string;
    lowestApiCount: number;
    lowestApiCountDate: string;
    lowestPlatform: string;
    totalAppPlatformCount: number;
    totalBotPlatformCount: number;
  };
  status: string;
};

export const useGetDailySummary = () => {
  return useQuery<DailySummaryResponse | null, Error>({
    queryKey: queryKeys.dailySummary,
    queryFn: () =>
      getJson<DailySummaryResponse>(API_CONFIG.DAILY_REPORT_SUMMARY),
    staleTime: STALE_TIME.live,
  });
};
