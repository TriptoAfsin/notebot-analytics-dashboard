import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { STALE_TIME } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type MissedWord = {
  id: number;
  missed_words: string;
};

type MissedWordsResponse = {
  missed_words: MissedWord[];
  pagination: {
    current_page: number;
    limit: number;
    total: number;
    total_pages: number;
    search: string;
  };
};

export const useGetMissedWords = (
  page: number = 1,
  limit: number = 500,
  search: string = ""
) => {
  return useQuery<MissedWordsResponse | null, Error>({
    queryKey: queryKeys.missedWords.page({ page, limit, search }),
    queryFn: () =>
      getJson<MissedWordsResponse>(API_CONFIG.MISSED_WORDS, {
        params: { page, limit, search },
      }),
    staleTime: STALE_TIME.standard,
    placeholderData: keepPreviousData,
  });
};
