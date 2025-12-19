import { authClient } from "@/core/auth";
import { LucideIcon, ShieldUser, UserRound } from "lucide-react";

type InferedAuthSession = typeof authClient.$Infer.Session;
export type AuthSession = {
  session: InferedAuthSession["session"];
  user: InferedAuthSession["user"] & { imageId: string };
};

export type Role = (typeof allRoles)[number];

export const allRoles = ["user", "admin"] as const;
export const defaultRole: Role = "user";

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
