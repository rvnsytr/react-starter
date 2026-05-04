import { authClient } from "@/core/auth";
import useSWR, { mutate, SWRConfiguration } from "swr";
import { AUTH_KEYS } from "../config/keys";

export function useListSessions(config?: SWRConfiguration) {
  return useSWR(
    AUTH_KEYS.sessions,
    async () => {
      const { data, error } = await authClient.listSessions();
      if (error) throw error;
      return data;
    },
    config,
  );
}

export const mutateListSessions = () => mutate(AUTH_KEYS.sessions);
