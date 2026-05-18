export const authKeys = {
  session: "/auth/get-session",
  users: "/auth/admin/list-users",
  sessions: "/auth/list-sessions",
  sessionsByUser: (userId: string) => `/auth/list-user-sessions?id=${userId}`,
} as const;
