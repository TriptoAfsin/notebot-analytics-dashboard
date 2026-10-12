/**
 * Every query key in one place.
 *
 * Keys were previously written inline at each call site, which makes it easy to
 * drift (`["app-users", page, limit, search]` in one hook, a different order in
 * the next) and hard to invalidate a group. Defining them here keeps the cache
 * keys consistent and lets callers invalidate by prefix — e.g.
 * `queryClient.invalidateQueries({ queryKey: queryKeys.appUsers.all })`.
 */
export type PaginatedParams = {
  page: number;
  limit: number;
  search: string;
};

export const queryKeys = {
  status: ["status", "both-platforms"] as const,

  dailyReport: ["daily-report"] as const,
  dailySummary: ["daily-summary"] as const,

  topNotes: ["top-notes"] as const,
  topLabs: ["top-labs"] as const,

  mcpSummary: (days: number) => ["mcp-summary", days] as const,
  mcpEmails: (params: PaginatedParams) => ["mcp-emails", params] as const,
  mcpKeys: (params: PaginatedParams) => ["mcp-keys", params] as const,

  appUsers: {
    all: ["app-users"] as const,
    page: (params: PaginatedParams) => ["app-users", params] as const,
  },
  gameScores: {
    all: ["game-scores"] as const,
    page: (params: PaginatedParams) => ["game-scores", params] as const,
  },
  missedWords: {
    all: ["missed-words"] as const,
    page: (params: PaginatedParams) => ["missed-words", params] as const,
  },
} as const;
