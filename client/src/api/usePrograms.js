import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export function usePrograms(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.status && params.status !== "all")
    queryParams.set("status", params.status);
  if (params.manager) queryParams.set("manager", params.manager);
  if (params.search) queryParams.set("search", params.search);

  const endpoint = `/programs?${queryParams.toString()}`;

  return useQuery({
    queryKey: queryKeys.programs.list(params),
    queryFn: async () => {
      const res = await apiClient(endpoint);
      return res.data ?? [];
    },
    staleTime: 30_000,
  });
}

export function useCreateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient("/programs", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
    },
  });
}

export function useUpdateProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient(`/programs/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
    },
  });
}

export function useDeleteProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient(`/programs/${id}`, {
        method: "DELETE",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.programs.all });
    },
  });
}
