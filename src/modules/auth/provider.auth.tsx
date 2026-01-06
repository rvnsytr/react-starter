import { authorizedRoute, normalizeRoute } from "@/core/utils";
import { notFound, useLocation } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { AuthSession, Role } from "./constants";
import { useSession } from "./hooks";

const AuthContext = createContext<AuthSession | undefined>(undefined);

export function AuthProvider({
  session: fallbackData,
  children,
}: {
  session: AuthSession;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const { data: session, isValidating } = useSession({ fallbackData });

  useEffect(() => {
    const normalizedPath = normalizeRoute(pathname);
    const role = session?.user.role as Role;
    const isAuthorized = authorizedRoute(normalizedPath, role);
    if (!isAuthorized && !isValidating) throw notFound();
  }, [pathname, session, isValidating]);

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
