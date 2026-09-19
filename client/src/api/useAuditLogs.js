import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export function useAuditLogs(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.user) queryParams.set("user", params.user);
  if (params.action && params.action !== "all")
    queryParams.set("action", params.action);
  if (params.from) queryParams.set("from", params.from);
  if (params.to) queryParams.set("to", params.to);

  const endpoint = `/audit-logs?${queryParams.toString()}`;

  return useQuery({
    queryKey: queryKeys.auditLogs.list(params),
    queryFn: async () => {
      const res = await apiClient(endpoint);
      return res;
    },
    staleTime: 15_000,
  });
}

export function useInfiniteAuditLogs(params = {}) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.auditLogs.all, "infinite", params],
    queryFn: async ({ pageParam = 1 }) => {
      const queryParams = new URLSearchParams();
      queryParams.set("page", String(pageParam));
      queryParams.set("limit", String(params.limit || 20));
      if (params.user) queryParams.set("user", params.user);
      if (params.action && params.action !== "all")
        queryParams.set("action", params.action);
      if (params.from) queryParams.set("from", params.from);
      if (params.to) queryParams.set("to", params.to);

      return apiClient(`/audit-logs?${queryParams.toString()}`);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination) return undefined;
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });
}
