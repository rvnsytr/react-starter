import { authorized, normalizeRoute } from "@/core/utils";
import { notFound, useLocation } from "@tanstack/react-router";
import { createContext, ReactNode, useContext, useEffect } from "react";
import { AuthSession } from "./constants";
import { useSession } from "./hooks";

type AuthContextType = AuthSession & { imageId: string | null };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  session: fallbackData,
  children,
}: {
  session: AuthSession;
  children: ReactNode;
}) {
  const { pathname } = useLocation();
  const { data: session } = useSession({ fallbackData });

  useEffect(() => {
    const normalizedPath = normalizeRoute(pathname);
    const isAuthorized = authorized(normalizedPath, session?.user.role);
    if (!isAuthorized) throw notFound();
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
