"use client";

import { authClient, AuthSession } from "@/core/auth";
import { useContext } from "react";
import { mutate, SWRConfiguration } from "swr";
import useSWRImmutable from "swr/immutable";
import { AUTH_KEYS } from "../config/keys";
import { AuthContext } from "../provider";

export function useSessionQuery(config?: SWRConfiguration) {
  return useSWRImmutable(
    AUTH_KEYS.session,
    async () => {
      const { data, error } = await authClient.getSession();
      if (error) throw error;
      return data as AuthSession | null;
    },
    config,
  );
}

export const mutateSession = () => mutate(AUTH_KEYS.session);

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSession must be used in AuthProvider");
  return ctx;
}
