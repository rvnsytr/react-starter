import { authClient } from "@/core/auth";
import { mutateData } from "@/core/components/ui/data-controller";
import useSWR, { mutate, SWRConfiguration } from "swr";
import { AuthSession } from "./constants";

export function useSession(config?: SWRConfiguration) {
  return useSWR(
    "/auth/get-session",
    async () => {
      const { data, error } = await authClient.getSession();
      if (error) throw error;
      return data as AuthSession | null;
    },
    config,
  );
}

export function useListSessions(config?: SWRConfiguration) {
  return useSWR(
    "/auth/list-sessions",
    async () => {
      const { data, error } = await authClient.listSessions();
      if (error) throw new Error(error.message);
      return data;
    },
    config,
  );
}

export function useListUserSessions(userId: string, config?: SWRConfiguration) {
  return useSWR(
    `/auth/list-user-sessions?id=${userId}`,
    async () => {
      const { data, error } = await authClient.admin.listUserSessions({
        userId,
      });
      if (error) throw new Error(error.message);
      return data.sessions as AuthSession["session"][];
    },
    config,
  );
}

export const mutateSession = () => mutate("/auth/get-session");

export const mutateListSessions = () => mutate("/auth/list-sessions");

export const mutateListUserSessions = (userId: string) =>
  mutate(`/auth/list-user-sessions?id=${userId}`);

export const mutateListUsers = () => mutateData("/auth/admin/list-users");
