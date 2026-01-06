import { authClient } from "@/core/auth";
import {
  BanIcon,
  CircleDotIcon,
  LucideIcon,
  ShieldUserIcon,
  UserRoundIcon,
} from "lucide-react";

type InferedAuthSession = typeof authClient.$Infer.Session;
export type AuthSession = {
  session: InferedAuthSession["session"];
  user: Omit<InferedAuthSession["user"], "role"> & {
    role: Role;
    imageId: string;
  };
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
    icon: UserRoundIcon,
    desc: "Pengguna standar dengan akses dan izin dasar.",
    color: "var(--primary)",
  },
  admin: {
    displayName: "Admin",
    icon: ShieldUserIcon,
    desc: "Administrator dengan akses penuh dan kontrol pengelolaan sistem.",
    color: "var(--rvns)",
  },
};

export type UserStatus = (typeof allUserStatus)[number];
export const allUserStatus = ["active", "banned"] as const;

export const userStatusMeta: Record<
  UserStatus,
  { displayName: string; desc: string; icon: LucideIcon; color: string }
> = {
  active: {
    displayName: "Aktif",
    desc: "Pengguna aktif dan dapat diakses",
    icon: CircleDotIcon,
    color: "var(--success)",
  },
  banned: {
    displayName: "Nonaktif",
    desc: "Pengguna diblokir dan tidak dapat mengakses sistem",
    icon: BanIcon,
    color: "var(--destructive)",
  },
};
