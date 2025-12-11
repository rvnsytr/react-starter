import { authClient } from "@/core/auth";
import { LucideIcon, ShieldUser, UserRound } from "lucide-react";

export type AuthSession = typeof authClient.$Infer.Session;
export type Role = (typeof allRoles)[number];
export const allRoles = ["user", "admin"] as const;

export const rolesMeta: Record<
  Role,
  { displayName: string; desc: string; icon: LucideIcon; color: string }
> = {
  user: {
    displayName: "Pengguna",
    icon: UserRound,
    desc: "Pengguna standar dengan akses dan izin dasar.",
    color: "var(--primary)",
  },
  admin: {
    displayName: "Admin",
    icon: ShieldUser,
    desc: "Administrator dengan akses penuh dan kontrol pengelolaan sistem.",
    color: "var(--rvns)",
  },
};
