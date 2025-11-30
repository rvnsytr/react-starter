import { Route } from "@/core/constants";
import { authorized, normalizeRoute } from "@/core/utils";
import { notFound, useLocation } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { Session } from "./constants";
import { useSession } from "./hooks";

const AuthContext = createContext<Session | undefined>(undefined);

export function AuthProvider({
  session: fallbackData,
  children,
}: {
  session: Session;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const { data: session } = useSession({ fallbackData });

  useEffect(() => {
    const normalizedPath = normalizeRoute(pathname);
    if (!authorized(normalizedPath as Route, session?.user.role))
      throw notFound();
  }, [pathname, session]);

  return (
    session && (
      <AuthContext.Provider value={{ ...session }}>
        {children}
      </AuthContext.Provider>
    )
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used in AuthProvider");
  return ctx;
}
