import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { STALE_TIME } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

type TopNoteSubject = {
  count: number;
  id: number;
  level: number;
  sub_name: string;
};

type TopLabSubject = {
  count: number;
  id: number;
  lab_name: string;
  level: number;
};

type TopNotesResponse = {
  topNoteSubjects: TopNoteSubject[];
};

type TopLabsResponse = {
  topLabSubjects: TopLabSubject[];
};

export const useGetTopNotes = () => {
  return useQuery<TopNotesResponse | null, Error>({
    queryKey: queryKeys.topNotes,
    queryFn: () => getJson<TopNotesResponse>(API_CONFIG.TOP_NOTES),
    staleTime: STALE_TIME.standard,
  });
};

export const useGetTopLabs = () => {
  return useQuery<TopLabsResponse | null, Error>({
    queryKey: queryKeys.topLabs,
    queryFn: () => getJson<TopLabsResponse>(API_CONFIG.TOP_LABS),
    staleTime: STALE_TIME.standard,
  });
};
