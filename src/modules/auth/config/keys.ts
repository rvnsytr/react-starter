export const AUTH_KEYS = {
  session: "/auth/get-session",
  users: "/auth/admin/list-users",
  sessions: "/auth/list-sessions",
  userSessions: (userId: string) => `/auth/list-user-sessions?id=${userId}`,
};
