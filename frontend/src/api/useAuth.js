import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./client";
import { queryKeys } from "./queryKeys";

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("msn_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredRole() {
  const user = getStoredUser();
  if (user?.role) return user.role;
  if (typeof window === "undefined") return null;
  const legacyRole = localStorage.getItem("msn_active_role");
  return legacyRole || null;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const res = await apiClient("/api/auth/me");
      if (res.data) {
        localStorage.setItem("msn_user", JSON.stringify(res.data));
        localStorage.setItem("msn_active_role", res.data.role);
      }
      return res.data;
    },
    placeholderData: getStoredUser() ?? undefined,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.token) {
        localStorage.setItem("msn_token", data.token);
      }
      if (data?.user) {
        localStorage.setItem("msn_user", JSON.stringify(data.user));
        localStorage.setItem("msn_active_role", data.user.role);
        queryClient.setQueryData(queryKeys.auth.me, data.user);
      }
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // JWT auth is stateless, so we just resolve immediately
      return true;
    },
    onSettled: () => {
      localStorage.removeItem("msn_token");
      localStorage.removeItem("msn_user");
      localStorage.removeItem("msn_active_role");
      queryClient.clear();
      window.location.href = "/sign-in";
    },
  });
}
