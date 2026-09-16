// API hooks and utilities — import from here instead of individual files
export { apiClient, ApiError, showToast, subscribeToast } from "./client";
export { queryClient } from "./queryClient";
export { queryKeys } from "./queryKeys";

export {
  useCurrentUser,
  useSignIn,
  useSignOut,
  getStoredUser,
  getStoredRole,
} from "./useAuth";

export {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "./useUsers";

export {
  usePrograms,
  useCreateProgram,
  useUpdateProgram,
  useDeleteProgram,
} from "./usePrograms";

export { useAuditLogs } from "./useAuditLogs";

export {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "./useNotifications";

export {
  usePlatformSettings,
  useUpdatePlatformSettings,
} from "./usePlatformSettings";
export { useRolesMatrix, useUpdateRoleMatrixRow } from "./useRolesMatrix";
