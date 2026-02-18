import { createContext, useContext } from "react";
import { AuthSession } from "./constants";

const AuthContext = createContext<AuthSession | undefined>(undefined);

export function AuthProvider({
  session,
  children,
}: {
  session: AuthSession;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={session}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used in AuthProvider");
  return ctx;
}
