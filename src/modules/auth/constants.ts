import { LucideIcon, ShieldUser, UserRoundCheck } from "lucide-react";
import z from "zod";
import { sessionSchema } from "./schemas";

export type Session = z.infer<typeof sessionSchema>;
// export type UserWithProfile = z.infer<typeof zodUserWithProfile>;

export type Role = (typeof allRoles)[number];
export const allRoles = ["user", "admin"] as const;

export const rolesMeta: Record<
  Role,
  { displayName: string; desc: string; icon: LucideIcon; color: string }
> = {
  user: {
    displayName: "Purnakarya",
    icon: UserRoundCheck,
    desc: "Pengguna standar dengan akses dan izin dasar.",
    color: "#f97316",
  },
  admin: {
    displayName: "Admin",
    icon: ShieldUser,
    desc: "Administrator dengan akses penuh dan kontrol pengelolaan sistem.",
    color: "var(--primary)",
  },
};
