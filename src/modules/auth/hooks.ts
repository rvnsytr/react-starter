import useSWR, { mutate, SWRConfiguration } from "swr";
import { getSession } from "./actions";

export function useSession(config?: SWRConfiguration) {
  return useSWR("session", getSession, config);
}

export const mutateSession = () => mutate("session");
