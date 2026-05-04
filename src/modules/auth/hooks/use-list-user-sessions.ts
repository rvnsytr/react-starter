import { authClient, AuthSession } from "@/core/auth";
import useSWR, { mutate, SWRConfiguration } from "swr";
import { AUTH_KEYS } from "../config/keys";

export function useListUserSessions(userId: string, config?: SWRConfiguration) {
  return useSWR(
    AUTH_KEYS.userSessions(userId),
    async () => {
      const { data, error } = await authClient.admin.listUserSessions({
        userId,
      });
      if (error) throw error;
      return data.sessions as AuthSession["session"][];
    },
    config,
  );
}

export const mutateListUserSessions = (userId: string) =>
  mutate(AUTH_KEYS.userSessions(userId));
