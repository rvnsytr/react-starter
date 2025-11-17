import { FileRouteTypes } from "@/routeTree.gen";
import { Role } from "../auth";

export type Route = FileRouteTypes["fullPaths"];
export type RouteRole = "all" | Role[];

export const routesMeta: Record<
  Route,
  { displayName: string; role?: RouteRole }
> = {
  "/": { displayName: "Beranda" },
  "/about": { displayName: "Tentang" },
  // "/sign-in": { displayName: "Masuk" },
  // "/dashboard": { displayName: "Dashboard", role: "all" },
  // "/dashboard/profile": { displayName: "Profil Saya", role: "all" },
  // "/dashboard/users": { displayName: "Pengguna", role: ["admin"] },
};
