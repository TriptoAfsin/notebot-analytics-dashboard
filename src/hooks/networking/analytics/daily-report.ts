import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { STALE_TIME } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

type DailyReportItem = {
  count: number;
  date: string;
  id: number;
  platform: string;
};

type DailyReportResponse = {
  data: DailyReportItem[];
  meta: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  status: string;
};

export const useGetDailyReport = () => {
  return useQuery<DailyReportResponse | null, Error>({
    queryKey: queryKeys.dailyReport,
    queryFn: () => getJson<DailyReportResponse>(API_CONFIG.DAILY_REPORT),
    staleTime: STALE_TIME.live,
  });
};
