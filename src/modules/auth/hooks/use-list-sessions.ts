import { authClient } from "@/core/auth";
import useSWR, { mutate, SWRConfiguration } from "swr";
import { authKeys } from "../config/keys";

export function useListSessions(config?: SWRConfiguration) {
  return useSWR(
    authKeys.sessions,
    async () => {
      const { data, error } = await authClient.listSessions();
      if (error) throw error;
      return data;
    },
    config,
  );
}

export const mutateListSessions = () => mutate(authKeys.sessions);
