import axios, { AxiosError, type AxiosRequestConfig } from "axios";

/**
 * Shared axios instance for every analytics request. Having one instance gives
 * a single place to set cross-cutting behaviour (timeouts, headers,
 * interceptors) instead of configuring each call site.
 */
export const apiClient = axios.create({
  timeout: 20_000,
});

/**
 * Runs a GET and normalises the result for React Query.
 *
 * Every query hook used to repeat the same try/catch, so this centralises it:
 * a missing body becomes `null`, and non-axios failures are wrapped in a plain
 * Error so `useQuery`'s error type is always an `Error`.
 */
export async function getJson<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T | null> {
  try {
    const response = await apiClient.get<T>(url, config);
    return response?.data ?? null;
  } catch (error) {
    if (error instanceof AxiosError) throw error;
    throw new Error("An unexpected error occurred");
  }
}

/** HTTP status of a failed request, when the failure came from the server. */
export function statusOf(error: unknown): number | undefined {
  return error instanceof AxiosError ? error.response?.status : undefined;
}
