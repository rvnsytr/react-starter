import { LinkProps } from "@tanstack/react-router";
import { ExternalLink, LayoutDashboard, LucideIcon } from "lucide-react";
import { Route } from "./routes";

type MenuContent = {
  route: Route;
  icon?: LucideIcon;
  disabled?: boolean;

  // if href is not defined, the Link href prop will be `/{route}/#${toKebabCase(displayName)}`
  subMenu?: {
    displayName: string;
    href?: LinkProps["to"];
    variant?: "default" | "destructive";
  }[];
};

export type Menu = { section: string; content: MenuContent[] };

export const dashboardMenu: Menu[] = [
  {
    section: "Umum",
    content: [
      { route: "/", icon: LayoutDashboard },
      // { route: "/dashboard/users", icon: UsersRound },
    ],
  },
  {
    section: "Pengaturan",
    content: [
      // {
      //   route: "/dashboard/profile",
      //   icon: UserRound,
      //   subMenu: [
      //     { displayName: "Informasi Pribadi" },
      //     { displayName: "Ubah Kata Sandi" },
      //     { displayName: "Sesi Aktif" },
      //     { displayName: "Hapus Akun", variant: "destructive" },
      //   ],
      // },
    ],
  },
];

export const dashboardfooterMenu: (Omit<MenuContent, "route" | "subMenu"> & {
  url: Route;
  displayName: string;
})[] = [
  { url: "/", displayName: "Beranda", icon: ExternalLink },
  // { url: "/help", displayName: "Bantuan", icon: CircleHelp, disabled: true },
];
