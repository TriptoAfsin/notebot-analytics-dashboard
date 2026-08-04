import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { STALE_TIME } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

type AppUser = {
  batch: number;
  dept: string;
  email: string;
  id: number;
  imgUrl: string;
  role: string;
  uni_id: string;
};

type AppUsersResponse = {
  current_page: number;
  limit: number;
  total: number;
  total_pages: number;
  users: AppUser[];
  search?: string;
};

export const useGetAppUsers = (
  page: number = 1,
  limit: number = 25,
  search: string = ""
) => {
  return useQuery<AppUsersResponse | null, Error>({
    queryKey: queryKeys.appUsers.page({ page, limit, search }),
    queryFn: () =>
      getJson<AppUsersResponse>(API_CONFIG.APP_USERS, {
        params: { page, limit, search },
      }),
    staleTime: STALE_TIME.standard,
    // Hold the previous page on screen while the next one loads, so paging and
    // typing in the search box no longer collapse the table into a skeleton.
    placeholderData: keepPreviousData,
  });
};
