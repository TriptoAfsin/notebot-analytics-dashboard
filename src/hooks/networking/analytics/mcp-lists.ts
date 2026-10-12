import { API_CONFIG } from "@/constants/api-config";
import { getJson } from "@/lib/api-client";
import { STALE_TIME } from "@/lib/query-client";
import { queryKeys } from "@/lib/query-keys";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

/** Times are Asia/Dhaka, "YYYY-MM-DD HH:mm"; "" when never. */
export type McpEmail = {
  email: string;
  firstSeen: string;
  lastSeen: string;
  sources: string;
  keyRequests: number;
  recoveryEmails: number;
  keys: number;
  activeKeys: number;
  requests: number;
  lastUsed: string;
  unsubscribed: boolean;
};

export type McpKey = {
  id: string;
  email: string;
  source: string;
  label: string;
  createdAt: string;
  lastUsed: string;
  requests: number;
  revoked: boolean;
};

type Paged = {
  total: number;
  current_page: number;
  limit: number;
  total_pages: number;
  search?: string;
};

export type McpEmailsResponse = Paged & { emails: McpEmail[] };
export type McpKeysResponse = Paged & { keys: McpKey[] };

export const useGetMcpEmails = (page = 1, limit = 25, search = "") =>
  useQuery<McpEmailsResponse | null, Error>({
    queryKey: queryKeys.mcpEmails({ page, limit, search }),
    queryFn: () =>
      getJson<McpEmailsResponse>(API_CONFIG.MCP_EMAILS, {
        params: { page, limit, search },
      }),
    staleTime: STALE_TIME.live,
    placeholderData: keepPreviousData,
  });

export const useGetMcpKeys = (page = 1, limit = 25, search = "") =>
  useQuery<McpKeysResponse | null, Error>({
    queryKey: queryKeys.mcpKeys({ page, limit, search }),
    queryFn: () =>
      getJson<McpKeysResponse>(API_CONFIG.MCP_KEYS, {
        params: { page, limit, search },
      }),
    staleTime: STALE_TIME.live,
    placeholderData: keepPreviousData,
  });
