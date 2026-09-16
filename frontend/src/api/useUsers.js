import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export function useUsers(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.set("page", String(params.page));
  if (params.limit) queryParams.set("limit", String(params.limit));
  if (params.role && params.role !== "all")
    queryParams.set("role", params.role);
  if (params.status && params.status !== "all")
    queryParams.set("status", params.status);
  if (params.search) queryParams.set("search", params.search);
  if (params.sort) queryParams.set("sort", params.sort);
  if (params.order) queryParams.set("order", params.order);

  const endpoint = `/users?${queryParams.toString()}`;

  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: async () => {
      const res = await apiClient(endpoint);
      return res;
    },
    staleTime: 30_000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient("/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      return res.data;
    },
    // Optimistic update for responsive UI
    onMutate: async (updatedUser) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });

      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.users.all,
      });

      queryClient.setQueriesData({ queryKey: queryKeys.users.all }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.map((user) =>
            user.id === updatedUser.id ? { ...user, ...updatedUser } : user,
          ),
        };
      });

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient(`/users/${id}`, {
        method: "DELETE",
      });
      return res.data;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.users.all });

      const previousQueries = queryClient.getQueriesData({
        queryKey: queryKeys.users.all,
      });

      queryClient.setQueriesData({ queryKey: queryKeys.users.all }, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.filter((user) => user.id !== deletedId),
        };
      });

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
