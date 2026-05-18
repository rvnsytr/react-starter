import { authClient, AuthSession } from "@/core/auth";
import useSWR, { mutate, SWRConfiguration } from "swr";
import { authKeys } from "../config/keys";

export function useListUserSessions(userId: string, config?: SWRConfiguration) {
  return useSWR(
    authKeys.sessionsByUser(userId),
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
  mutate(authKeys.sessionsByUser(userId));
