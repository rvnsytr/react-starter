import { Role } from "@/modules/auth";
import { FileRouteTypes } from "@/routeTree.gen";

export type Route = FileRouteTypes["to"];
export type RouteRole = "all" | Role[];

export const routesMeta: Record<
  Route,
  { displayName: string; role?: RouteRole }
> = {
  "/": { displayName: "Beranda" },
  "/about": { displayName: "Tentang" },
  "/sign-in": { displayName: "Masuk" },

  "/verify-user": { displayName: "Verifikasi Pengguna" },
  "/reset-password": { displayName: "Atur Ulang Kata Sandi" },

  "/dashboard": { displayName: "Dashboard", role: "all" },
  "/dashboard/users": { displayName: "Pengguna", role: ["admin"] },
  "/dashboard/profile": { displayName: "Profil Saya", role: "all" },
  "/dashboard/settings": { displayName: "Pengaturan", role: "all" },
};
