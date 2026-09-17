import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export function useNotifications(filter = {}) {
  const queryParams = new URLSearchParams();
  if (filter.category && filter.category.toLowerCase() !== "all") {
    queryParams.set("category", filter.category);
  }
  if (filter.unread) {
    queryParams.set("unread", "true");
  }

  const endpoint = `/notifications?${queryParams.toString()}`;

  return useQuery({
    queryKey: queryKeys.notifications.list(filter),
    queryFn: async () => {
      const res = await apiClient(endpoint);
      return res.data ?? [];
    },
    staleTime: 15_000,
    refetchInterval: 30000, // 30 second polling
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient(`/notifications/${id}/read`, {
        method: "POST",   // backend: POST /:id/read
      });
      return res.data;
    },
    // Optimistic update
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.notifications.all,
      });

      const previous = queryClient.getQueryData(queryKeys.notifications.all);

      queryClient.setQueriesData(
        { queryKey: queryKeys.notifications.all },
        (old) => {
          if (!old) return [];
          return old.map((n) =>
            n.id === id || String(n.id) === String(id)
              ? { ...n, isRead: true }
              : n,
          );
        },
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.all, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient("/notifications/read-all", {
        method: "POST",   // backend: POST /read-all
      });
    },
    // Optimistic update
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.notifications.all,
      });

      queryClient.setQueriesData(
        { queryKey: queryKeys.notifications.all },
        (old) => {
          if (!old) return [];
          return old.map((n) => ({ ...n, isRead: true }));
        },
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}
