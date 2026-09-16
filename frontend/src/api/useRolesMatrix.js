import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export function useRolesMatrix() {
  return useQuery({
    queryKey: queryKeys.rolesMatrix.all,
    queryFn: async () => {
      const res = await apiClient("/roles-matrix");
      return res.data ?? [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes staleTime for roles matrix
  });
}

export function useUpdateRoleMatrixRow() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, permissions }) => {
      const res = await apiClient(`/roles-matrix/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ permissions }),
      });
      return res.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.rolesMatrix.all, (old) => {
        if (!old) return [updated];
        return old.map((row) => (row.id === updated.id ? updated : row));
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.rolesMatrix.all });
    },
  });
}
