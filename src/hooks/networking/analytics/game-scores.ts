import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { STALE_TIME } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type GameScore = {
  date: string;
  score: number;
  email: string;
  user_name: string;
};

type GameScoresResponse = {
  hof: GameScore[];
  total: number;
  current_page: number;
  limit: number;
  total_pages: number;
  search: string;
};

export const useGetGameScores = (
  page: number = 1,
  limit: number = 100,
  search: string = ""
) => {
  return useQuery<GameScoresResponse | null, Error>({
    queryKey: queryKeys.gameScores.page({ page, limit, search }),
    queryFn: () =>
      getJson<GameScoresResponse>(API_CONFIG.GAME_SCORES, {
        params: { page, limit, search },
      }),
    staleTime: STALE_TIME.standard,
    placeholderData: keepPreviousData,
  });
};
