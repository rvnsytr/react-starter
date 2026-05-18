"use client";

import { authClient, AuthSession } from "@/core/auth";
import { useContext } from "react";
import { mutate, SWRConfiguration } from "swr";
import useSWRImmutable from "swr/immutable";
import { authKeys } from "../config/keys";
import { AuthContext } from "../provider";

export function useSessionQuery(config?: SWRConfiguration) {
  return useSWRImmutable(
    authKeys.session,
    async () => {
      const { data, error } = await authClient.getSession();
      if (error) throw error;
      return data as AuthSession | null;
    },
    config,
  );
}

export const mutateSession = () => mutate(authKeys.session);

export function useSession() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useSession must be used in AuthProvider");
  return ctx;
}
