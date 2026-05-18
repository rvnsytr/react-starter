export const activityKeys = {
  list: "/activities",
  getByUser: (userId: string) => `/activities/${userId}`,
} as const;
