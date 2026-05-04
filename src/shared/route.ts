import { Route, RouteRole } from "@/core/route";

export const routesConfig: Record<Route, { label: string; role?: RouteRole }> =
  {
    "/": { label: "Beranda" },
    "/about": { label: "Tentang" },
    "/sign-in": { label: "Masuk" },

    "/verify-user": { label: "Verifikasi Pengguna" },
    "/reset-password": { label: "Atur Ulang Kata Sandi" },

    "/dashboard": { label: "Dashboard", role: "all" },
    "/dashboard/users": { label: "Pengguna", role: ["admin"] },
    "/dashboard/profile": { label: "Profil Saya", role: "all" },
    "/dashboard/settings": { label: "Pengaturan", role: "all" },
  };
