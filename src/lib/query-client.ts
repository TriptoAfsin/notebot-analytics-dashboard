import { QueryClient } from "@tanstack/react-query";
import { statusOf } from "./api-client";

/**
 * How long each class of data stays fresh. Previously every query used the
 * default `staleTime: 0`, which meant any remount — switching tabs, navigating
 * back to the dashboard, refocusing the window — refetched everything. Matching
 * the stale window to how fast the data actually changes removes almost all of
 * those redundant requests while keeping the numbers current.
 */
export const STALE_TIME = {
  /** Liveness pings — cheap, and worth keeping close to real time. */
  status: 30_000,
  /** Daily interaction counters, refreshed continuously upstream. */
  live: 60_000,
  /** Paginated tables and leaderboards. */
  standard: 5 * 60_000,
  /** Notes/labs/syllabus taxonomy — effectively static within a session. */
  static: 30 * 60_000,
} as const;

/** Keep cached pages around well past their stale window for instant back-nav. */
const GC_TIME = 30 * 60_000;

/**
 * Retrying a request the server already rejected (bad params, missing route,
 * unauthorised) just multiplies the failure, so only transient errors —
 * network drops and 5xx — are worth a second attempt.
 */
function shouldRetry(failureCount: number, error: Error) {
  const status = statusOf(error);

  if (status !== undefined && status >= 400 && status < 500) return false;

  return failureCount < 2;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME.standard,
      gcTime: GC_TIME,
      retry: shouldRetry,
      // Exponential backoff, capped so a flaky upstream can't stall the UI.
      retryDelay: attempt => Math.min(1_000 * 2 ** attempt, 15_000),
      // Both are gated by staleTime, so fresh data is served from cache and
      // only genuinely stale queries hit the network.
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      // Skip the refetch a remount would otherwise trigger on fresh data.
      refetchOnMount: true,
    },
  },
});
