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
  description: string;
  icon: LucideIcon;
  color?: string;
};

export type EventLogType = (typeof allEventLogType)[number];

export const allEventLogType = [
  "user-registered",
  "user-created",
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
  EventLogMetaData | ((data: string | null) => EventLogMetaData)
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
    description: 'Kata sandi diatur ulang melalui fitur "Lupa Kata Sandi".',
    icon: LockKeyholeOpenIcon,
    color: "var(--foreground)",
  },
  "password-changed": {
    displayName: "Kata Sandi Diperbarui",
    description: 'Kata sandi diperbarui melalui fitur "Ubah Kata Sandi".',
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

  "admin-user-create": (name) => ({
    displayName: "Admin Menambahkan Akun",
    description: `Admin menambahkan akun atas nama '${name}' ke dalam sistem.`,
    icon: UserRoundPlusIcon,
    color: "var(--color-success)",
  }),
  // "admin-user-import": (total) => ({
  //   displayName: "Mengimpor Akun",
  //   description: `Mengimpor ${total} akun ke dalam sistem melalui fitur 'Import User'.`,
  //   icon: ImportIcon,
  //   color: "var(--color-sky-500)",
  // }),
  "admin-user-update-role": (name) => ({
    displayName: "Admin Mengubah Peran",
    description: `Admin mengubah peran akun '${name}'.`,
    icon: UserRoundCogIcon,
    color: "var(--color-sky-500)",
  }),
  "admin-user-ban": (name) => ({
    displayName: "Admin Memblokir Akun",
    description: `Admin memblokir akun atas nama '${name}'.`,
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
  }),
  "admin-user-unban": (name) => ({
    displayName: "Admin Membuka Blokir Akun",
    description: `Admin membuka blokir akun atas nama '${name}'.`,
    icon: UserRoundCheckIcon,
    color: "var(--color-foreground)",
  }),
  "admin-user-remove": (name) => ({
    displayName: "Admin Menghapus Akun",
    description: `Admin menghapus akun atas nama '${name}' dari sistem.`,
    icon: UserRoundXIcon,
    color: "var(--color-destructive)",
  }),
};
