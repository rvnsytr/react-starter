import { Route, RouteRole } from "@/core/types";

export const routeConfig: Record<Route, { title: string; role?: RouteRole }> = {
  "/": { title: "Beranda" },
  "/about": { title: "Tentang" },
  "/sign-in": { title: "Masuk" },

  "/verify-user": { title: "Verifikasi Pengguna" },
  "/reset-password": { title: "Atur Ulang Kata Sandi" },

  "/dashboard": { title: "Dashboard", role: "all" },
  "/dashboard/users": { title: "Pengguna", role: ["admin"] },

  "/dashboard/profile": { title: "Profil Saya", role: "all" },
  "/dashboard/settings": { title: "Pengaturan", role: "all" },
};
