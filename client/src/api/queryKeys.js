export const queryKeys = {
  users: {
    all: ["users"],
    lists: () => [...queryKeys.users.all, "list"],
    list: (filters) => [...queryKeys.users.lists(), filters ?? {}],
    details: () => [...queryKeys.users.all, "detail"],
    detail: (id) => [...queryKeys.users.details(), id],
  },
  programs: {
    all: ["programs"],
    lists: () => [...queryKeys.programs.all, "list"],
    list: (filters) => [...queryKeys.programs.lists(), filters ?? {}],
  },
  auditLogs: {
    all: ["auditLogs"],
    lists: () => [...queryKeys.auditLogs.all, "list"],
    list: (filters) => [...queryKeys.auditLogs.lists(), filters ?? {}],
  },
  notifications: {
    all: ["notifications"],
    list: (filters) => [...queryKeys.notifications.all, "list", filters ?? {}],
  },
  platformSettings: {
    all: ["platformSettings"],
  },
  rolesMatrix: {
    all: ["rolesMatrix"],
  },
  auth: {
    me: ["auth", "me"],
  },
};
