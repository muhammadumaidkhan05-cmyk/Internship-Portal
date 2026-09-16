import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export function usePlatformSettings() {
  return useQuery({
    queryKey: queryKeys.platformSettings.all,
    queryFn: async () => {
      const res = await apiClient("/platform-settings");
      return res.data ?? null;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes staleTime for slowly changing settings
  });
}

export function useUpdatePlatformSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient("/platform-settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      return res.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.platformSettings.all, updated);
      queryClient.invalidateQueries({
        queryKey: queryKeys.platformSettings.all,
      });
    },
  });
}
