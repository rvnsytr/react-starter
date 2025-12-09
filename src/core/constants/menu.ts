import { LinkProps } from "@tanstack/react-router";
import {
  CircleHelp,
  ExternalLink,
  LayoutDashboard,
  LucideIcon,
  UsersRound,
} from "lucide-react";
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
      { route: "/dashboard", icon: LayoutDashboard },
      { route: "/dashboard/users", icon: UsersRound },
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

export const dashboardfooterMenu: (MenuContent & { displayName: string })[] = [
  { route: "/", displayName: "Beranda", icon: ExternalLink },
  {
    route: "/dashboard",
    displayName: "Bantuan",
    icon: CircleHelp,
    disabled: true,
  },
];
