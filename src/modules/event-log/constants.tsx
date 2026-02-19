import {
  LockKeyholeOpenIcon,
  LucideIcon,
  PlusCircleIcon,
  UserRoundCheckIcon,
  UserRoundCogIcon,
  UserRoundPenIcon,
  UserRoundPlusIcon,
  UserRoundXIcon,
  UserSquare2Icon,
} from "lucide-react";
import z from "zod";
import { eventLogSchema } from "./schema";

export type EventLog = z.infer<typeof eventLogSchema>;
type EventLogMetaData = {
  displayName: string;
  description: React.ReactNode;
  icon: LucideIcon;
  color?: string;
};

export type EventLogType = (typeof allEventLogType)[number];
export const allEventLogType = [
  "user-registered",
  "user-created",
  // "user-imported",
  // "user-activated",
  "user-verified",
  "user-banned",
  "user-unbanned",
  // "user-removed",

  "profile-updated",
  "profile-image-updated",

  "password-reset",
  "password-changed",

  "admin-user-create",
  // "admin-user-import",
  "admin-user-update-role",
  "admin-user-ban",
  "admin-user-unban",
  "admin-user-remove",
] as const;

export const eventLogMeta: Record<
  EventLog["type"],
  | EventLogMetaData
  | ((ctx?: Pick<EventLog, "data" | "entity">) => EventLogMetaData)
> = {
  "user-registered": {
    displayName: "Akun Terdaftar",
    description: "Pengguna berhasil mendaftar ke dalam sistem.",
    icon: PlusCircleIcon,
    color: "var(--color-success)",
  },
  "user-created": {
    displayName: "Akun Dibuat",
    description: "Akun berhasil dibuat dan ditambahkan ke dalam sistem.",
    icon: PlusCircleIcon,
    color: "var(--color-success)",
  },
  // "user-imported": {
  //   displayName: "Akun Diimpor",
  //   description: "Akun berhasil dimuat melalui loader ke dalam sistem.",
  //   icon: PlusCircleIcon,
  //   color: "var(--color-success)",
  // },
  // "user-activated": {
  //   displayName: "Akun Diaktivasi",
  //   description:
  //     "Pengguna mengaktifkan akunnya dan melanjutkan ke proses verifikasi.",
  //   icon: UserRoundCheckIcon,
  //   color: "var(--color-success)",
  // },
  "user-verified": {
    displayName: "Akun Diverifikasi",
    description:
      "Pengguna memverifikasi akun melalui email dan dapat mengakses sistem.",
    icon: UserRoundCheckIcon,
    color: "var(--color-success)",
  },
  "user-banned": {
    displayName: "Akun Diblokir",
    description: "Pengguna diblokir dan tidak dapat mengakses sistem.",
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
  },
  "user-unbanned": {
    displayName: "Blokir Akun Dicabut",
    description: "Blokir pada akun dicabut dan akses telah dipulihkan.",
    icon: UserRoundCheckIcon,
    color: "var(--color-foreground)",
  },
  // "user-removed": {
  //   displayName: "Akun Dihapus",
  //   description: "Akun dihapus dari sistem.",
  //   icon: Trash2Icon,
  //   color: "var(--color-destructive)",
  // },

  "password-reset": {
    displayName: "Kata Sandi Diatur Ulang",
    description: (
      <>
        Kata sandi diatur ulang melalui fitur <span>Lupa Kata Sandi</span>.
      </>
    ),
    icon: LockKeyholeOpenIcon,
    color: "var(--foreground)",
  },
  "password-changed": {
    displayName: "Kata Sandi Diperbarui",
    description: (
      <>
        Kata sandi diperbarui melalui fitur <span>Ubah Kata Sandi</span>.
      </>
    ),
    icon: LockKeyholeOpenIcon,
    color: "var(--foreground)",
  },

  "profile-updated": {
    displayName: "Profil Diperbarui",
    description: "Pengguna memperbarui informasi profil.",
    icon: UserRoundPenIcon,
    color: "var(--foreground)",
  },
  "profile-image-updated": {
    displayName: "Foto Profil Diperbarui",
    description: "Pengguna memperbarui foto profil.",
    icon: UserSquare2Icon,
    color: "var(--foreground)",
  },

  "admin-user-create": (c) => ({
    displayName: "Admin Menambahkan Akun",
    description: (
      <>
        Admin menambahkan akun atas nama <span>{c?.entity}</span> ke dalam
        sistem.
      </>
    ),
    icon: UserRoundPlusIcon,
    color: "var(--color-success)",
  }),
  // "admin-user-import": (c) => ({
  //   displayName: "Mengimpor Akun",
  //   description: (
  //     <>
  //       Mengimpor <span>{c?.data} akun</span> ke dalam sistem melalui fitur{" "}
  //       <span>Import User</span>.
  //     </>
  //   ),
  //   icon: ImportIcon,
  //   color: "var(--color-sky-500)",
  // }),
  "admin-user-update-role": (c) => ({
    displayName: "Admin Mengubah Peran",
    description: (
      <>
        Admin mengubah peran akun <span>{c?.entity}</span>.
      </>
    ),
    icon: UserRoundCogIcon,
    color: "var(--color-sky-500)",
  }),
  "admin-user-ban": (c) => ({
    displayName: "Admin Memblokir Akun",
    description: (
      <>
        Admin memblokir akun atas nama <span>{c?.entity}</span>.
      </>
    ),
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
  }),
  "admin-user-unban": (c) => ({
    displayName: "Admin Membuka Blokir Akun",
    description: (
      <>
        Admin membuka blokir akun atas nama <span>{c?.entity}</span>.
      </>
    ),
    icon: UserRoundCheckIcon,
    color: "var(--color-foreground)",
  }),
  "admin-user-remove": (c) => ({
    displayName: "Admin Menghapus Akun",
    description: (
      <>
        Admin menghapus akun atas nama <span>{c?.entity}</span> dari sistem.
      </>
    ),
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
  }),
};

export function getEventLogMeta(
  type: EventLogType,
  ctx?: Pick<EventLog, "data" | "entity">,
) {
  const meta = eventLogMeta[type];
  return typeof meta === "function" ? meta(ctx) : meta;
}
